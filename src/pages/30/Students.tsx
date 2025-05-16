// ExcelUpload.tsx
import { Select, Button, notification } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { text } from 'node:stream/consumers';
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

export interface PlanOfStudy {
    departmentId: number;
    departmentName: string;
    courses: Course[];
    prerequisitesCorequisites: CourseLink[];
}

export interface Course {
  
    code: string;
    title: string;
    credits: number;
    type: CourseType;
    semesters: SemesterType;
}
export interface TableCourse {
    code: string;
    title: string;
    credits: number;
    type: CourseType;
    semesters: SemesterType;
    prerequisites: string;
    corequisites: string;
}
export type CourseType =
    | 'Core'
    | 'Major'
    | 'Major Elective'
    | 'General Elective'
    | 'General Requirement';

export type SemesterType =
    | 'Fall'
    | 'Spring'
    | 'Summer'
    | 'Fall-Spring'
    | 'Fall-Summer'
    | 'Spring-Summer'
    | 'Fall-Spring-Summer';

export interface CourseLink {
    courseId: string;
    coursePre: string;
    courseCo: string;
}
const departments = [
    { id: 101, name: 'Communication Engineering' },
    { id: 102, name: 'Computer Science' },
    { id: 103, name: 'Mechanical Engineering' }
];

//$env:NODE_OPTIONS = "--openssl-legacy-provider"; yarn start
const ExcelUpload: React.FC = () => {
    const [selectedDept, setSelectedDept] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [columnsRaw, setColumnsRaw] = useState<string[]>();
    const [dataRaw, setDataRaw] = useState<TableCourse[]>([]);
    const [planOfStudy, setPlanOfStudy] = useState<PlanOfStudy>({
        departmentId: 0,
        departmentName: '',
        courses: [],
        prerequisitesCorequisites: []
    });

    const formatCourseType = (rawType: string | undefined): CourseType => {
        const cleaned = (rawType || 'Core')
            .toString()
            .trim()


        const validTypes: CourseType[] = [
            'Core',
            'Major',
            'Major Elective',
            'General Elective',
            'General Requirement'
        ];

        return validTypes.includes(cleaned as CourseType)
            ? cleaned as CourseType
            : 'Core';
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];//retrieves the first file selected by the user
        if (!file) return;
        setLoading(true);
        try {
            // Read Excel file as binary data
            const data = await file.arrayBuffer();
            // Reads the file’s content as a low-level binary (ArrayBuffer)

            // Parse the Excel file into a workbook object
            const workbook = XLSX.read(data, { type: 'array' });
            // XLSX.read(): Parses raw binary data using the SheetJS xlsx library
            // { type: 'array' }: Specifies that the input is an ArrayBuffer (from file.arrayBuffer())

            // Get the first sheet from the workbook
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            // workbook.SheetNames: Array of sheet names, like ["Sheet1", "Sheet2"]
            // workbook.Sheets: Object containing actual sheet data, keyed by sheet names
            // Each sheet represents a separate tab or page in Excel

            // Convert the sheet data into a 2D array of rows and cells
            const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
            // XLSX.utils.sheet_to_json(): Converts the sheet into a JavaScript-friendly format
            // { header: 1 }: Tells it to return a 2D array (not JSON objects)
            // Each inner array represents a row; each item in the array is a cell
            // raw is a """"""2D ARRAY""""""
            setColumnsRaw(raw[2]);
            const datatoTable = raw.slice(3);
            const parsed: TableCourse[] = datatoTable.map(row => ({
                code: row[0]?.toString() || '',
                title: row[1]?.toString() || '',
                credits: Number(row[2] || 0),
                prerequisites: row[3]?.toString() || '',
                corequisites: row[4]?.toString() || '',
                type: row[5] as CourseType,
                semesters: row[6] as SemesterType,
            }));
            setDataRaw(parsed);
         
            const columns = useMemo<ColumnsType<TableCourse>>(() => {
                return (columnsRaw ?? []).map(header => {
                    // use the header _as is_ for dataIndex/key (exact match)
                    const dataIndex = header.trim() as keyof TableCourse;

                    return {
                        title: header,
                        dataIndex,
                        key: dataIndex,
                    };
                });
            }, [columnsRaw]);
           
            
            console.log('Raw Excel Data:', raw);
            // single pre or co are showing as numbers
            // multiple pre or co dash seperated are showing as string


            // Fetching the department code (id) from the data line, e.g.:
            // "Bachelor of Science in Communication Engineering (TENG)-43"
            const codeRow = raw.find(row =>
                // Find the row that:
                // 1. Has exactly one cell
                row.length === 1 &&
                // 2. That cell is a string
                typeof row[0] === 'string' &&
                // 3. The cell's string ends with a dash followed by one or more digits
                /-\d+$/.test(row[0])
                // Explanation of the regex /-\d+$/:
                // '-' matches a literal dash
                // '\d' matches any digit from 0-9
                // '+' means one or more digits
                // '$' asserts that this pattern is at the end of the string
                // Example match: "ABC-43"
            );

            let departmentCode: string | null = null;

            if (codeRow) {
                const cellText = codeRow[0];

                // Extract the digits after the dash at the end of the string
                const match = cellText.match(/-(\d+)$/);
                // match explanation:
                // match[0] contains the entire matched string including dash (e.g. "-43")
                // match[1] contains the capture group inside parentheses, i.e. the digits (e.g. "43")

                if (match) {
                    departmentCode = match[1];  // Extracted department code, e.g. "43"
                }
            }


            console.log("departmentCode", departmentCode); // → "43"
            // Extract Metadata,Metadata is "data about data", columns
            const metadataRow = raw.find(row =>
                row[4]?.includes('Major Title:') &&
                row[4]?.includes('Major Code:')
            );
            console.log("metadataRow", metadataRow);
            if (!metadataRow) throw new Error('Metadata row not found');

            //string manipluation
            const metadataContent = metadataRow[4]
                .replace(/\r/g, '\n')
                .split('\n')
                .map(line => line.trim());
            console.log("metadataContent", metadataContent);
            const departmentName = metadataContent[0].split(': ')[1]?.trim() || '';
            console.log("departmentName", departmentName);
            const majorCodeLine = metadataContent[2].split(': ')[1]?.trim() || '';
            console.log("majorCodeLine", majorCodeLine);
            const majorCode = majorCodeLine.match(/TENG\d*/)?.[0] || 'TENG000';
            console.log("majorCode", majorCode);

            // Find Header Row
            // find the row containing the column titles
            const headerIndex = raw.findIndex(row =>
                row[0] === 'Code' &&
                row[1] === 'Title' &&
                row[2] === 'Credits'
            );
            console.log("headerIndex", headerIndex);
            if (headerIndex === -1) throw new Error('Header row not found');

            // Process Courses
            const courses: Course[] = [];
            const courseMap = new Map<string, number>();
            const links: CourseLink[] = [];

            // First Pass: Create all courses
            raw.slice(headerIndex + 1).forEach((row) => {
                if (!row[0] || row[0].toString().startsWith('Total') || row[0] === 'Code') return;
                const courseid = row[0].match(/\d+/) ?? '';
                const course: Course = {
                  
                    code: row[0].toString().trim(),
                    title: `${row[0].toString().trim()}: ${row[1]?.toString().trim() || ''}`,
                    credits: Number(row[2]),
                    type: formatCourseType(row[5]?.toString()),
                    semesters: (row[6].toString().trim() as SemesterType) ?? 'Fall',
                };

                courseMap.set(course.code, Number(courseid[0]));
                courses.push(course);

            });
            const safeSplit = (s?: string) =>
                (s ?? '')   // if s is null or undefined, use empty string
                    .split('-')
                    .filter(item => item && item !== 'undefined'); // drop empty or literal "undefined"
            // Second Pass: Process requirements
            raw.slice(headerIndex + 1).forEach((row) => {
                if (!row[0] || row[0].toString().startsWith('Total') || row[0] === 'Code') return;
                const courseid = row[0].match(/\d+/) ?? '';
                const currentCourseId = Number(courseid[0]);
                if (!currentCourseId) return;

                const processLinks = (codesPre?: string, codesCo?: string) => {
                    const preArray = safeSplit(codesPre);
                    const coArray = safeSplit(codesCo);

                    for (let i = 0, j = 0; i < preArray.length || j < coArray.length; i++, j++) {
                        const pre = preArray[i] ?? null;
                        const co = coArray[j] ?? null;

                        // only push if there’s something real
                        if (pre || co) {
                            links.push({
                                courseId: row[0],
                                coursePre: pre,
                                courseCo: co,
                            });
                        }
                    }
                };

                processLinks((String(row[3]) ?? ''), (String(row[4])) ?? '');
            });

            console.log('Processed Courses:', courses);
            console.log('Course Links:', links);

            setPlanOfStudy({
                departmentId: Number(departmentCode),
                departmentName,
                courses,
                prerequisitesCorequisites: links
            });

        } catch (error) {
            console.log('File Processing Error:', error);

        } finally {
            setLoading(false);
        }
    };
    const columns: ColumnsType<Course> = [
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Credits', dataIndex: 'credits', key: 'credits' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Semesters', dataIndex: 'semesters', key: 'semesters' },
        { title: 'Prerequisites', dataIndex: 'prerequisites', key: 'prerequisites' },
        { title: 'Corequisites', dataIndex: 'corequisites', key: 'corequisites' },
    ];
    const handleSubmit = () => {
        if (!planOfStudy || !selectedDept) return;
        const dept = departments.find(d => d.id === selectedDept)!;
        const payload = {
            ...planOfStudy,
            departmentId: dept.id,
            departmentName: dept.name
        };
        console.log('Submitting Plan of Study:', payload);
        notification.success;
    };
    return (
        <div style={{ padding: 24 }}>
            <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                style={{ marginBottom: 16 }}
            />

            {planOfStudy && (
                <>
                    <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
                        <Select
                            placeholder="Select Department"
                            style={{ width: 240 }}
                            onChange={value => setSelectedDept(value)}
                            value={selectedDept || undefined}
                        >
                            {departments.map(d => (
                                <Select.Option key={d.id} value={d.id}>
                                    {d.name}
                                </Select.Option>
                            ))}
                        </Select>

                        <Button
                            type="primary"
                            disabled={!selectedDept || loading}
                            onClick={handleSubmit}
                        >
                            Submit Plan of Study
                        </Button>
                    </div>

                    <Table
                        rowKey="code"
                        loading={loading}
                        dataSource={dataRaw}
                        columns={columns}
                        pagination={{ pageSize: 10 }}
                    />
                  
                </>
            )}
        </div>
    );
};

export default ExcelUpload;