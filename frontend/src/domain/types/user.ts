export interface UserDTO {
    id: number;
    email: string;
    role: 'student' | 'admin' | 'faculty';
}
