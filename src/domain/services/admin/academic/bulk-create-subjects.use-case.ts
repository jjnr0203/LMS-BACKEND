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
    for (const item of dto.subjects) {
      let subject = await this.subjectRepository.findByCode(item.code);
      
      if (subject) {
        // Update name and credits if changed
        subject.name = item.name;
        subject.credits = item.credits;
        if (item.modalityIds) {
          subject.modalityIds = item.modalityIds;
        }
        await this.subjectRepository.save(subject);
      } else {
        // Create new subject
        subject = new SubjectEntity(
          uuidv4(),
          item.name,
          item.code,
          item.credits,
          item.modalityIds || []
        );
        await this.subjectRepository.save(subject);
      }

      // Assign to career
      const existingRelation = await this.careerSubjectRepository.findByCareerAndSubject(dto.careerId, subject.id);
      if (existingRelation) {
        existingRelation.semester = item.semester;
        await this.careerSubjectRepository.save(existingRelation);
      } else {
        const relation = new CareerSubject(
          uuidv4(),
          dto.careerId,
          subject.id,
          item.semester
        );
        await this.careerSubjectRepository.save(relation);
      }
    }
  }
}
