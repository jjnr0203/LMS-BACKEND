import {
  GradeSubmissionUseCasePort,
  GradeSubmissionCommand,
} from '../../ports/inbound/teacher/grade-submission.use-case.port';
import { SubmissionRepositoryPort } from '../../ports/outbound/academic/submission-repository.port';
import { AssignmentRepositoryPort } from '../../ports/outbound/academic/assignment-repository.port';
import { SubmissionEntity } from '../../entities/academic/submission.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export class GradeSubmissionUseCase implements GradeSubmissionUseCasePort {
  constructor(
    private readonly submissionRepository: SubmissionRepositoryPort,
    private readonly assignmentRepository: AssignmentRepositoryPort,
  ) {}

  async execute(
    command: GradeSubmissionCommand,
  ): Promise<{ submission: SubmissionEntity }> {
    const submission = await this.submissionRepository.findById(
      command.submissionId,
    );
    if (!submission) {
      throw new NotFoundException('Entrega no encontrada');
    }

    const assignment = await this.assignmentRepository.findById(
      submission.assignmentId,
    );
    if (!assignment) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (command.grade < 0 || command.grade > assignment.maxScore) {
      throw new BadRequestException(
        `La calificación debe estar entre 0 y ${assignment.maxScore}`,
      );
    }

    const updatedSubmission = new SubmissionEntity(
      submission.id,
      submission.assignmentId,
      submission.studentId,
      submission.fileUrl,
      command.grade,
      command.feedback ?? null,
      submission.submittedAt,
    );

    const savedSubmission =
      await this.submissionRepository.save(updatedSubmission);
    return { submission: savedSubmission };
  }
}
