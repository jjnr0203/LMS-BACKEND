import { SubjectRepositoryPort } from '../../../ports/outbound/academic/subject-repository.port';
import { CareerSubjectRepositoryPort } from '../../../ports/outbound/academic/career-subject-repository.port';
import { SubjectEntity } from '../../../entities/academic/subject.entity';
import { CareerSubject } from '../../../entities/academic/career-subject.entity';
import { BulkSubjectsDto } from '../../../../application/dto/admin/academic.dto';
import { v4 as uuidv4 } from 'uuid';

export class BulkCreateSubjectsUseCase {
  constructor(
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
  ) {}

  async execute(dto: BulkSubjectsDto): Promise<void> {
    const codes = dto.subjects.map((item) => item.code);
    const existingSubjects = await this.subjectRepository.findByCodes(codes);
    const existingByCode = new Map<string, SubjectEntity>();
    for (const sub of existingSubjects) {
      existingByCode.set(sub.code, sub);
    }

    for (const item of dto.subjects) {
      let subject = existingByCode.get(item.code);

      if (subject) {
        subject.name = item.name;
        subject.credits = item.credits;

        await this.subjectRepository.save(subject);
      } else {
        subject = new SubjectEntity(
          uuidv4(),
          item.name,
          item.code,
          item.credits,
          item.hours || 0,
        );
        await this.subjectRepository.save(subject);
        existingByCode.set(item.code, subject);
      }

      let relation = await this.careerSubjectRepository.findByCareerAndSubject(
        dto.careerId,
        subject.id,
      );
      if (relation) {
        relation.semester = item.semester;
        relation.curriculumId = item.curriculumId || dto.curriculumId;
        await this.careerSubjectRepository.save(relation);
      } else {
        relation = new CareerSubject(
          uuidv4(),
          dto.careerId,
          subject.id,
          item.semester,
          item.curriculumId || dto.curriculumId,
        );
        await this.careerSubjectRepository.save(relation);
      }
    }

    // Second pass: Update successors
    for (const item of dto.subjects) {
      if (item.successorCodes && item.successorCodes.length > 0) {
        const parentSubject = existingByCode.get(item.code);
        if (!parentSubject) continue;

        const parentRelation = await this.careerSubjectRepository.findByCareerAndSubject(
          dto.careerId,
          parentSubject.id,
        );
        if (!parentRelation) continue;

        for (const sCode of item.successorCodes) {
          let sSubject = existingByCode.get(sCode);
          if (!sSubject) {
            const subjectsFromDb = await this.subjectRepository.findByCodes([sCode]);
            if (subjectsFromDb.length > 0) {
              sSubject = subjectsFromDb[0];
              existingByCode.set(sCode, sSubject);
            }
          }

          if (sSubject) {
            const sRelation = await this.careerSubjectRepository.findByCareerAndSubject(
              dto.careerId,
              sSubject.id,
            );
            if (sRelation) {
              if (!sRelation.prerequisiteIds) {
                sRelation.prerequisiteIds = [];
              }
              if (!sRelation.prerequisiteIds.includes(parentRelation.id)) {
                sRelation.prerequisiteIds.push(parentRelation.id);
                await this.careerSubjectRepository.save(sRelation);
              }
            }
          }
        }
      }
    }
  }
}
