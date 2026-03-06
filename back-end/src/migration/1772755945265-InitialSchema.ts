import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1772755945265 implements MigrationInterface {
  name = "Initial1772755945265";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a9f01c8d132a255d61263d52e" ON "order" ("userId", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c10a44a29ef231062f22b1b7ac" ON "book" ("title") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85c8d63d50f8e617e2a4917671" ON "book" ("author") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_85c8d63d50f8e617e2a4917671"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c10a44a29ef231062f22b1b7ac"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a9f01c8d132a255d61263d52e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
