import { AdministrativeDepartment } from '../../common/enums/role.enum';

export class AdministrativeStaff {
  constructor(
    public readonly userId: string,
    public hireDate: Date,
    public assignedDepartment: AdministrativeDepartment,
    public position: string,
    public isActive: boolean,
  ) {}
}
