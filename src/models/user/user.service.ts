import { PrismaService } from 'src/common/prisma.service';

export class UserService {
  constructor(private prisma: PrismaService) {}
}
