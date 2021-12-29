import {MigrationInterface, QueryRunner} from "typeorm";

export class total1640749501814 implements MigrationInterface {
    name = 'total1640749501814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "total" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total"`);
    }

}
