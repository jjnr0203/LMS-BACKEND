import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';

import { ManageAcademicTermsUseCase } from '@domain/services/admin/academic/manage-academic-terms.use-case';
import { ManageModalitiesUseCase } from '@domain/services/admin/academic/manage-modalities.use-case';
import { ManageJornadasUseCase } from '@domain/services/admin/academic/manage-jornadas.use-case';
import { ManageCareersUseCase } from '@domain/services/admin/academic/manage-careers.use-case';
import { ManageSubjectsUseCase } from '@domain/services/admin/academic/manage-subjects.use-case';
import { BulkCreateSubjectsUseCase } from '@domain/services/admin/academic/bulk-create-subjects.use-case';
import { ManageSemesterColorsUseCase } from '@domain/services/admin/manage-semester-colors.use-case';
import { ManageCurriculumsUseCase } from '@domain/services/admin/academic/manage-curriculums.use-case';
import { GetCareerBreakdownUseCase } from '@domain/services/admin/academic/get-career-breakdown.use-case';
import { ManageFacultiesUseCase } from '@domain/services/admin/academic/manage-faculties.use-case';
import { UpdatePrerequisitesUseCase } from '@domain/services/admin/academic/update-prerequisites.use-case';
import { UpdateSuccessorsUseCase } from '@domain/services/admin/academic/update-successors.use-case';

import {
  CreateAcademicTermDto,
  CreateModalityDto,
  CreateJornadaDto,
  CreateCareerDto,
  AssignSubjectsDto,
  CreateSubjectDto,
  BulkSubjectsDto,
  CreateCurriculumDto,
  CreateFacultyDto,
  UpdatePrerequisitesDto,
  UpdateSuccessorsDto,
} from '../../dto/admin/academic.dto';

@Controller('admin/academic')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminAcademicController {
  constructor(
    private readonly manageTermsUC: ManageAcademicTermsUseCase,
    private readonly manageModalitiesUC: ManageModalitiesUseCase,
    private readonly manageJornadasUC: ManageJornadasUseCase,
    private readonly manageCareersUC: ManageCareersUseCase,
    private readonly manageSubjectsUC: ManageSubjectsUseCase,
    private readonly bulkCreateSubjectsUC: BulkCreateSubjectsUseCase,
    private readonly manageSemesterColorsUC: ManageSemesterColorsUseCase,
    private readonly manageCurriculumsUC: ManageCurriculumsUseCase,
    private readonly getCareerBreakdownUC: GetCareerBreakdownUseCase,
    private readonly manageFacultiesUC: ManageFacultiesUseCase,
    private readonly updatePrerequisitesUC: UpdatePrerequisitesUseCase,
    private readonly updateSuccessorsUC: UpdateSuccessorsUseCase,
  ) {}

  // --- SEMESTER COLORS ---
  @Roles('admin', 'coordinator', 'human_resources')
  @Get('semester-colors')
  async getSemesterColors() {
    return this.manageSemesterColorsUC.getColors();
  }

  @Post('semester-colors')
  async saveSemesterColor(@Body() dto: { semester: number; color: string }) {
    await this.manageSemesterColorsUC.saveColor(dto.semester, dto.color);
    return { success: true };
  }

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
  async updateTerm(
    @Param('id') id: string,
    @Body() dto: Partial<CreateAcademicTermDto>,
  ) {
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
  async updateModality(
    @Param('id') id: string,
    @Body() dto: Partial<CreateModalityDto>,
  ) {
    const res = await this.manageModalitiesUC.update(id, dto);
    if (!res)
      throw new HttpException('Modality not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('modalities/:id')
  async deleteModality(@Param('id') id: string) {
    await this.manageModalitiesUC.delete(id);
    return { success: true };
  }

  // --- JORNADAS ---
  @Get('jornadas')
  async getJornadas() {
    return this.manageJornadasUC.findAll();
  }

  @Post('jornadas')
  async createJornada(@Body() dto: CreateJornadaDto) {
    return this.manageJornadasUC.create(dto);
  }

  @Put('jornadas/:id')
  async updateJornada(
    @Param('id') id: string,
    @Body() dto: Partial<CreateJornadaDto>,
  ) {
    const res = await this.manageJornadasUC.update(id, dto);
    if (!res)
      throw new HttpException('Jornada not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('jornadas/:id')
  async deleteJornada(@Param('id') id: string) {
    await this.manageJornadasUC.delete(id);
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
  async updateCareer(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCareerDto>,
  ) {
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
  async assignSubjects(
    @Param('id') id: string,
    @Body() dto: AssignSubjectsDto,
  ) {
    await this.manageCareersUC.assignSubjects(id, dto);
    return { success: true };
  }

  // --- CURRICULUMS ---
  @Get('careers/:careerId/curriculums')
  async getCurriculumsByCareer(@Param('careerId') careerId: string) {
    return this.manageCurriculumsUC.findAllByCareer(careerId);
  }

  @Post('careers/:careerId/curriculums')
  async createCurriculum(
    @Param('careerId') careerId: string,
    @Body() dto: CreateCurriculumDto,
  ) {
    return this.manageCurriculumsUC.create({ ...dto, careerId });
  }

  @Put('curriculums/:id')
  async updateCurriculum(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCurriculumDto>,
  ) {
    const res = await this.manageCurriculumsUC.update(id, dto);
    if (!res)
      throw new HttpException('Curriculum not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('curriculums/:id')
  async deleteCurriculum(@Param('id') id: string) {
    await this.manageCurriculumsUC.delete(id);
    return { success: true };
  }

  @Get('curriculums/:id/subjects')
  async getCurriculumSubjects(@Param('id') id: string) {
    const subjects = await this.manageCurriculumsUC.getSubjectsByCurriculum(id);
    return subjects;
  }

  @Get('curriculums/:curriculumId/possible-prerequisites')
  async getPossiblePrerequisites(
    @Param('curriculumId') curriculumId: string,
    @Query('excludeCareerSubjectId') excludeCareerSubjectId?: string,
  ) {
    const subjects =
      await this.manageCurriculumsUC.getSubjectsByCurriculum(curriculumId);
    if (!excludeCareerSubjectId) return subjects;
    return subjects.filter((s) => s.relationId !== excludeCareerSubjectId);
  }

  @Patch('career-subjects/:id/prerequisites')
  async updatePrerequisites(
    @Param('id') id: string,
    @Body() dto: UpdatePrerequisitesDto,
  ) {
    await this.updatePrerequisitesUC.execute(id, dto.prerequisiteIds || []);
    return { success: true };
  }

  @Patch('career-subjects/:id/successors')
  async updateSuccessors(
    @Param('id') id: string,
    @Body() dto: UpdateSuccessorsDto,
  ) {
    await this.updateSuccessorsUC.execute(id, dto.successorIds || []);
    return { success: true };
  }

  // --- CAREER BREAKDOWN (desglose academico detail) ---
  @Get('careers/:id/breakdown')
  async getCareerBreakdown(@Param('id') id: string): Promise<object> {
    const breakdown = await this.getCareerBreakdownUC.execute(id);
    if (!breakdown)
      throw new HttpException('Career not found', HttpStatus.NOT_FOUND);
    return breakdown;
  }

  // --- FACULTIES ---
  @Roles('admin', 'human_resources', 'coordinator')
  @Get('faculties')
  async getFaculties() {
    return this.manageFacultiesUC.findAll();
  }

  @Post('faculties')
  async createFaculty(@Body() dto: CreateFacultyDto) {
    return this.manageFacultiesUC.create(dto);
  }

  @Put('faculties/:id')
  async updateFaculty(
    @Param('id') id: string,
    @Body() dto: Partial<CreateFacultyDto>,
  ) {
    const res = await this.manageFacultiesUC.update(id, dto);
    if (!res)
      throw new HttpException('Faculty not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('faculties/:id')
  async deleteFaculty(@Param('id') id: string) {
    await this.manageFacultiesUC.delete(id);
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

  @Post('subjects/bulk-upload')
  async bulkCreateSubjects(@Body() dto: BulkSubjectsDto) {
    await this.bulkCreateSubjectsUC.execute(dto);
    return { success: true };
  }

  @Put('subjects/:id')
  async updateSubject(
    @Param('id') id: string,
    @Body() dto: Partial<CreateSubjectDto>,
  ) {
    const res = await this.manageSubjectsUC.update(id, dto);
    if (!res)
      throw new HttpException('Subject not found', HttpStatus.NOT_FOUND);
    return res;
  }

  @Delete('subjects/clear-all')
  async deleteAllSubjects() {
    await this.manageSubjectsUC.deleteAll();
    return { success: true };
  }

  @Delete('subjects/:id')
  async deleteSubject(@Param('id') id: string) {
    await this.manageSubjectsUC.delete(id);
    return { success: true };
  }
}
