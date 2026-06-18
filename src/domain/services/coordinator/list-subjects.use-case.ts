import { Injectable } from '@nestjs/common';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';

@Injectable()
export class ListSubjectsUseCase {
  constructor(private readonly subjectRepository: SubjectRepositoryPort) {}

  async execute() {
    const subjects = await this.subjectRepository.findAll();
    return { subjects };
  }
}
