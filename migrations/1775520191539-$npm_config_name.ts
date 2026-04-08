import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1775520191539 implements MigrationInterface {
    name = ' $npmConfigName1775520191539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "status" character varying NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "assignedUserId" uuid NOT NULL, "assignedById" uuid NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "data" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "actorId" uuid NOT NULL, "targetTaskId" uuid NOT NULL, CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'employee'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_e3bd734666db0cb70e8c8d542c8" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_d67cd7c5e34f48cf33be802898a" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_cb6aa6f6fd56f08eafb60316225" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_log" ADD CONSTRAINT "FK_1104203ea98ec442c4e62ad0596" FOREIGN KEY ("targetTaskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_1104203ea98ec442c4e62ad0596"`);
        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_cb6aa6f6fd56f08eafb60316225"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_d67cd7c5e34f48cf33be802898a"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_e3bd734666db0cb70e8c8d542c8"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
