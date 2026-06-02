export interface UpdatePasswordCommand {
  id: string; // Target user's cedula
  currentPassword?: string; // Optional if Admin is resetting it
  newPassword: string;
}

export abstract class UpdatePasswordUseCasePort {
  abstract execute(command: UpdatePasswordCommand): Promise<void>;
}
