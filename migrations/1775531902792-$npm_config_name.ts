import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1775531902792 implements MigrationInterface {
    name = ' $npmConfigName1775531902792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "isDeleted"`);
    }

}
