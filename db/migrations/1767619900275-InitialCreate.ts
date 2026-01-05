import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreate1767619900275 implements MigrationInterface {
  name = 'InitialCreate1767619900275'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "url" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "originalUrl" character varying NOT NULL, "shortUrl" character varying NOT NULL, "expiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c2d12ff0f1539bfc1b2db9dda61" UNIQUE ("originalUrl"), CONSTRAINT "UQ_5f81972de6fed8a2e99a818a8b6" UNIQUE ("shortUrl"), CONSTRAINT "PK_7421088122ee64b55556dfc3a91" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "rate_limit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "targetId" character varying NOT NULL, "endpoint" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_51ea620fc09d92f5dc3cdc46a70" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "url" ADD CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "url" DROP CONSTRAINT "FK_2919f59acab0f44b9a244d35bdb"`);
    await queryRunner.query(`DROP TABLE "rate_limit"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "url"`);
  }

}
