import {MigrationInterface, QueryRunner} from "typeorm";

export class a1640748871016 implements MigrationInterface {
    name = 'a1640748871016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "total" integer NOT NULL`);
    }

}
