import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['teacher', 'student'], {
        errorMap: () => ({ message: 'Role must be defined' })
    })
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

const classSchema = z.object({
    name: z.string().min(3, 'Class name must be at least 3 characters'),
    subject: z.string().min(2, 'Subject must be at least 2 characters'),
    students: z.array(z.string()).optional()
});

const markAttendanceSchema = z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    status: z.enum(['present', 'absent'])
});

export { signupSchema, loginSchema, classSchema, markAttendanceSchema };
