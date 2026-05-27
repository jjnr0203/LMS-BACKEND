export class Teacher {
  constructor(
    public readonly userId: string,
    public hireDate: Date,
    public specialization: string,
    public academicDegree: string,
    public isActive: boolean,
  ) {}
}
