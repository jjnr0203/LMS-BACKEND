import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';

import { ManageAcademicTermsUseCase } from '@domain/services/admin/academic/manage-academic-terms.use-case';
import { ManageModalitiesUseCase } from '@domain/services/admin/academic/manage-modalities.use-case';
import { ManageCareersUseCase } from '@domain/services/admin/academic/manage-careers.use-case';
import { ManageSubjectsUseCase } from '@domain/services/admin/academic/manage-subjects.use-case';

import { 
  CreateAcademicTermDto, 
  CreateModalityDto, 
  CreateCareerDto, 
  AssignSubjectsDto, 
  CreateSubjectDto 
} from '../../dto/admin/academic.dto';

@Controller('admin/academic')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminAcademicController {
  constructor(
    private readonly manageTermsUC: ManageAcademicTermsUseCase,
    private readonly manageModalitiesUC: ManageModalitiesUseCase,
    private readonly manageCareersUC: ManageCareersUseCase,
    private readonly manageSubjectsUC: ManageSubjectsUseCase,
  ) {}

  // --- ACADEMIC TERMS ---
  @Get('terms')
  async getTerms() {
    return this.manageTermsUC.findAll();
  }

  @Post('terms')
  async createTerm(@Body() dto: CreateAcademicTermDto) {
    return this.manageTermsUC.create(dto);
  }

  @Put('terms/:id')
  async updateTerm(@Param('id') id: string, @Body() dto: Partial<CreateAcademicTermDto>) {
    const res = await this.manageTermsUC.update(id, dto);
    if (!res) throw new HttpException('Term not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('terms/:id')
  async deleteTerm(@Param('id') id: string) {
    await this.manageTermsUC.delete(id);
    return { success: true };
  }

  // --- MODALITIES ---
  @Get('modalities')
  async getModalities() {
    return this.manageModalitiesUC.findAll();
  }

  @Post('modalities')
  async createModality(@Body() dto: CreateModalityDto) {
    return this.manageModalitiesUC.create(dto);
  }

  @Put('modalities/:id')
  async updateModality(@Param('id') id: string, @Body() dto: Partial<CreateModalityDto>) {
    const res = await this.manageModalitiesUC.update(id, dto);
    if (!res) throw new HttpException('Modality not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('modalities/:id')
  async deleteModality(@Param('id') id: string) {
    await this.manageModalitiesUC.delete(id);
    return { success: true };
  }

  // --- CAREERS ---
  @Get('careers')
  async getCareers() {
    return this.manageCareersUC.findAll();
  }

  @Post('careers')
  async createCareer(@Body() dto: CreateCareerDto) {
    return this.manageCareersUC.create(dto);
  }

  @Put('careers/:id')
  async updateCareer(@Param('id') id: string, @Body() dto: Partial<CreateCareerDto>) {
    const res = await this.manageCareersUC.update(id, dto);
    if (!res) throw new HttpException('Career not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('careers/:id')
  async deleteCareer(@Param('id') id: string) {
    await this.manageCareersUC.delete(id);
    return { success: true };
  }

  @Get('careers/:id/subjects')
  async getAssignedSubjects(@Param('id') id: string) {
    const subjects = await this.manageCareersUC.getAssignedSubjects(id);
    return { subjectIds: subjects };
  }

  @Put('careers/:id/subjects')
  async assignSubjects(@Param('id') id: string, @Body() dto: AssignSubjectsDto) {
    await this.manageCareersUC.assignSubjects(id, dto);
    return { success: true };
  }

  // --- SUBJECTS ---
  @Get('subjects')
  async getSubjects() {
    return this.manageSubjectsUC.findAll();
  }

  @Post('subjects')
  async createSubject(@Body() dto: CreateSubjectDto) {
    return this.manageSubjectsUC.create(dto);
  }

  @Put('subjects/:id')
  async updateSubject(@Param('id') id: string, @Body() dto: Partial<CreateSubjectDto>) {
    const res = await this.manageSubjectsUC.update(id, dto);
    if (!res) throw new HttpException('Subject not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('subjects/:id')
  async deleteSubject(@Param('id') id: string) {
    await this.manageSubjectsUC.delete(id);
    return { success: true };
  }
}
