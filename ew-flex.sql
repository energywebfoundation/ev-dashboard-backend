/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : PostgreSQL
 Source Server Version : 120001
 Source Host           : localhost:5432
 Source Catalog        : ew-flex
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 120001
 File Encoding         : 65001

 Date: 27/02/2020 22:39:30
*/


-- ----------------------------
-- Sequence structure for activationsummary_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."activationsummary_id_seq";
CREATE SEQUENCE "public"."activationsummary_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."activationsummary_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for asset_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."asset_id_seq";
CREATE SEQUENCE "public"."asset_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."asset_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for assetstate_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."assetstate_id_seq";
CREATE SEQUENCE "public"."assetstate_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."assetstate_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for assettype_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."assettype_id_seq";
CREATE SEQUENCE "public"."assettype_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."assettype_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for claim_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."claim_id_seq";
CREATE SEQUENCE "public"."claim_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."claim_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for claimtype_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."claimtype_id_seq";
CREATE SEQUENCE "public"."claimtype_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."claimtype_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for constraints_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."constraints_id_seq";
CREATE SEQUENCE "public"."constraints_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."constraints_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for deliverywindow_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."deliverywindow_id_seq";
CREATE SEQUENCE "public"."deliverywindow_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."deliverywindow_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for offer_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."offer_id_seq";
CREATE SEQUENCE "public"."offer_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."offer_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for offerbundle_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."offerbundle_id_seq";
CREATE SEQUENCE "public"."offerbundle_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."offerbundle_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for offerbundlestate_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."offerbundlestate_id_seq";
CREATE SEQUENCE "public"."offerbundlestate_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."offerbundlestate_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for offerstate_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."offerstate_id_seq";
CREATE SEQUENCE "public"."offerstate_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."offerstate_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for participant_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."participant_id_seq";
CREATE SEQUENCE "public"."participant_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."participant_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for participanttype_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."participanttype_id_seq";
CREATE SEQUENCE "public"."participanttype_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."participanttype_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Table structure for activationsummary
-- ----------------------------
DROP TABLE IF EXISTS "public"."activationsummary";
CREATE TABLE "public"."activationsummary" (
  "id" int4 NOT NULL DEFAULT nextval('activationsummary_id_seq'::regclass),
  "offerid" int4,
  "summary" text COLLATE "pg_catalog"."default" NOT NULL,
  "timestamp" timestamptz(6) NOT NULL
)
;
ALTER TABLE "public"."activationsummary" OWNER TO "postgres";

-- ----------------------------
-- Table structure for asset
-- ----------------------------
DROP TABLE IF EXISTS "public"."asset";
CREATE TABLE "public"."asset" (
  "id" int4 NOT NULL DEFAULT nextval('asset_id_seq'::regclass),
  "serialnumber" text COLLATE "pg_catalog"."default",
  "ownerid" text COLLATE "pg_catalog"."default",
  "claimid" int4,
  "publickey" text COLLATE "pg_catalog"."default",
  "assettypeid" int4,
  "assetstateid" int4,
  "equipmentname" text COLLATE "pg_catalog"."default",
  "modelnumber" text COLLATE "pg_catalog"."default",
  "manufacturer" text COLLATE "pg_catalog"."default",
  "approved" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."asset" OWNER TO "postgres";

-- ----------------------------
-- Table structure for assetstate
-- ----------------------------
DROP TABLE IF EXISTS "public"."assetstate";
CREATE TABLE "public"."assetstate" (
  "id" int4 NOT NULL DEFAULT nextval('assetstate_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "claimtypeid" int4 NOT NULL
)
;
ALTER TABLE "public"."assetstate" OWNER TO "postgres";

-- ----------------------------
-- Table structure for assettype
-- ----------------------------
DROP TABLE IF EXISTS "public"."assettype";
CREATE TABLE "public"."assettype" (
  "id" int4 NOT NULL DEFAULT nextval('assettype_id_seq'::regclass),
  "code" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."assettype" OWNER TO "postgres";

-- ----------------------------
-- Table structure for claim
-- ----------------------------
DROP TABLE IF EXISTS "public"."claim";
CREATE TABLE "public"."claim" (
  "id" int4 NOT NULL DEFAULT nextval('claim_id_seq'::regclass),
  "ownerid" text COLLATE "pg_catalog"."default",
  "issuerid" text COLLATE "pg_catalog"."default",
  "claimdata" text COLLATE "pg_catalog"."default",
  "claimtypeid" int4,
  "claimurl" text COLLATE "pg_catalog"."default",
  "isservicepoint" bool
)
;
ALTER TABLE "public"."claim" OWNER TO "postgres";

-- ----------------------------
-- Table structure for claimtype
-- ----------------------------
DROP TABLE IF EXISTS "public"."claimtype";
CREATE TABLE "public"."claimtype" (
  "id" int4 NOT NULL DEFAULT nextval('claimtype_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "ownerparticipanttypeid" int4,
  "issuerparticipanttypeid" int4,
  "requiredschema" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."claimtype" OWNER TO "postgres";

-- ----------------------------
-- Records of claimtype
-- ----------------------------
BEGIN;
INSERT INTO "public"."claimtype" VALUES (1, 'Participant Endorsement', NULL, NULL, NULL);
INSERT INTO "public"."claimtype" VALUES (2, 'Asset Ownership', NULL, NULL, NULL);
INSERT INTO "public"."claimtype" VALUES (3, 'Device Installation', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for constraints
-- ----------------------------
DROP TABLE IF EXISTS "public"."constraints";
CREATE TABLE "public"."constraints" (
  "id" int4 NOT NULL DEFAULT nextval('constraints_id_seq'::regclass),
  "constraints" text COLLATE "pg_catalog"."default" NOT NULL,
  "deliveryperiod" timestamptz(6) NOT NULL,
  "limit" int4 NOT NULL,
  "ownerid" int4
)
;
ALTER TABLE "public"."constraints" OWNER TO "postgres";

-- ----------------------------
-- Table structure for deliverywindow
-- ----------------------------
DROP TABLE IF EXISTS "public"."deliverywindow";
CREATE TABLE "public"."deliverywindow" (
  "id" int4 NOT NULL DEFAULT nextval('deliverywindow_id_seq'::regclass),
  "starttime" int4 NOT NULL,
  "endtime" int4 NOT NULL
)
;
ALTER TABLE "public"."deliverywindow" OWNER TO "postgres";

-- ----------------------------
-- Table structure for offer
-- ----------------------------
DROP TABLE IF EXISTS "public"."offer";
CREATE TABLE "public"."offer" (
  "id" int4 NOT NULL DEFAULT nextval('offer_id_seq'::regclass),
  "date" timestamptz(6) NOT NULL,
  "offertype" int4 NOT NULL,
  "created" timestamptz(6) NOT NULL,
  "timeslot" text COLLATE "pg_catalog"."default",
  "offerid" text COLLATE "pg_catalog"."default",
  "capacity" int4 NOT NULL,
  "price" int4 NOT NULL,
  "deliverywindowid" int4,
  "offerstateid" int4,
  "assetid" int4,
  "ownerid" int4,
  "offerbundleid" int4,
  "activationsummaryid" int4
)
;
ALTER TABLE "public"."offer" OWNER TO "postgres";

-- ----------------------------
-- Table structure for offerbundle
-- ----------------------------
DROP TABLE IF EXISTS "public"."offerbundle";
CREATE TABLE "public"."offerbundle" (
  "id" int4 NOT NULL DEFAULT nextval('offerbundle_id_seq'::regclass),
  "timestamp" timestamptz(6) NOT NULL,
  "demandofferid" int4,
  "capacity" int4,
  "roothash" text COLLATE "pg_catalog"."default",
  "offerbundlestateid" int4,
  "uuid" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."offerbundle" OWNER TO "postgres";

-- ----------------------------
-- Table structure for offerbundlestate
-- ----------------------------
DROP TABLE IF EXISTS "public"."offerbundlestate";
CREATE TABLE "public"."offerbundlestate" (
  "id" int4 NOT NULL DEFAULT nextval('offerbundlestate_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."offerbundlestate" OWNER TO "postgres";

-- ----------------------------
-- Records of offerbundlestate
-- ----------------------------
BEGIN;
INSERT INTO "public"."offerbundlestate" VALUES (1, 'Rejected');
INSERT INTO "public"."offerbundlestate" VALUES (2, 'Reserved');
INSERT INTO "public"."offerbundlestate" VALUES (3, 'Accepted');
COMMIT;

-- ----------------------------
-- Table structure for offerstate
-- ----------------------------
DROP TABLE IF EXISTS "public"."offerstate";
CREATE TABLE "public"."offerstate" (
  "id" int4 NOT NULL DEFAULT nextval('offerstate_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "claimtypeid" int4 NOT NULL
)
;
ALTER TABLE "public"."offerstate" OWNER TO "postgres";

-- ----------------------------
-- Records of offerstate
-- ----------------------------
BEGIN;
INSERT INTO "public"."offerstate" VALUES (1, 'Pending', 0);
INSERT INTO "public"."offerstate" VALUES (2, 'Pending Confirm', 0);
INSERT INTO "public"."offerstate" VALUES (3, 'Pending Submit', 0);
INSERT INTO "public"."offerstate" VALUES (4, 'Pending Activation', 0);
INSERT INTO "public"."offerstate" VALUES (5, 'Confirm', 0);
INSERT INTO "public"."offerstate" VALUES (6, 'Reserved', 0);
INSERT INTO "public"."offerstate" VALUES (7, 'Activation', 0);
COMMIT;

-- ----------------------------
-- Table structure for participant
-- ----------------------------
DROP TABLE IF EXISTS "public"."participant";
CREATE TABLE "public"."participant" (
  "id" int4 NOT NULL DEFAULT nextval('participant_id_seq'::regclass),
  "did" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "organizationtype" text COLLATE "pg_catalog"."default" NOT NULL,
  "postaladdress" text COLLATE "pg_catalog"."default" NOT NULL,
  "meteringaddress" text COLLATE "pg_catalog"."default",
  "participanttypeid" int4
)
;
ALTER TABLE "public"."participant" OWNER TO "postgres";

-- ----------------------------
-- Table structure for participanttype
-- ----------------------------
DROP TABLE IF EXISTS "public"."participanttype";
CREATE TABLE "public"."participanttype" (
  "id" int4 NOT NULL DEFAULT nextval('participanttype_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default",
  "claimtypeid" int4
)
;
ALTER TABLE "public"."participanttype" OWNER TO "postgres";

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."activationsummary_id_seq"
OWNED BY "public"."activationsummary"."id";
SELECT setval('"public"."activationsummary_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."asset_id_seq"
OWNED BY "public"."asset"."id";
SELECT setval('"public"."asset_id_seq"', 7, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."assetstate_id_seq"
OWNED BY "public"."assetstate"."id";
SELECT setval('"public"."assetstate_id_seq"', 4, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."assettype_id_seq"
OWNED BY "public"."assettype"."id";
SELECT setval('"public"."assettype_id_seq"', 4, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."claim_id_seq"
OWNED BY "public"."claim"."id";
SELECT setval('"public"."claim_id_seq"', 16, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."claimtype_id_seq"
OWNED BY "public"."claimtype"."id";
SELECT setval('"public"."claimtype_id_seq"', 6, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."constraints_id_seq"
OWNED BY "public"."constraints"."id";
SELECT setval('"public"."constraints_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."deliverywindow_id_seq"
OWNED BY "public"."deliverywindow"."id";
SELECT setval('"public"."deliverywindow_id_seq"', 4, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."offer_id_seq"
OWNED BY "public"."offer"."id";
SELECT setval('"public"."offer_id_seq"', 15, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."offerbundle_id_seq"
OWNED BY "public"."offerbundle"."id";
SELECT setval('"public"."offerbundle_id_seq"', 8, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."offerbundlestate_id_seq"
OWNED BY "public"."offerbundlestate"."id";
SELECT setval('"public"."offerbundlestate_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."offerstate_id_seq"
OWNED BY "public"."offerstate"."id";
SELECT setval('"public"."offerstate_id_seq"', 10, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."participant_id_seq"
OWNED BY "public"."participant"."id";
SELECT setval('"public"."participant_id_seq"', 14, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."participanttype_id_seq"
OWNED BY "public"."participanttype"."id";
SELECT setval('"public"."participanttype_id_seq"', 4, false);

-- ----------------------------
-- Primary Key structure for table activationsummary
-- ----------------------------
ALTER TABLE "public"."activationsummary" ADD CONSTRAINT "activationsummary_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table asset
-- ----------------------------
ALTER TABLE "public"."asset" ADD CONSTRAINT "asset_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table assetstate
-- ----------------------------
ALTER TABLE "public"."assetstate" ADD CONSTRAINT "assetstate_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table assettype
-- ----------------------------
ALTER TABLE "public"."assettype" ADD CONSTRAINT "assettype_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table claim
-- ----------------------------
ALTER TABLE "public"."claim" ADD CONSTRAINT "claim_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table claimtype
-- ----------------------------
ALTER TABLE "public"."claimtype" ADD CONSTRAINT "claimtype_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table constraints
-- ----------------------------
ALTER TABLE "public"."constraints" ADD CONSTRAINT "constraints_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table deliverywindow
-- ----------------------------
ALTER TABLE "public"."deliverywindow" ADD CONSTRAINT "deliverywindow_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table offer
-- ----------------------------
ALTER TABLE "public"."offer" ADD CONSTRAINT "offer_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table offerbundle
-- ----------------------------
ALTER TABLE "public"."offerbundle" ADD CONSTRAINT "offerbundle_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table offerbundlestate
-- ----------------------------
ALTER TABLE "public"."offerbundlestate" ADD CONSTRAINT "offerbundlestate_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table offerstate
-- ----------------------------
ALTER TABLE "public"."offerstate" ADD CONSTRAINT "offerstate_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table participant
-- ----------------------------
ALTER TABLE "public"."participant" ADD CONSTRAINT "participant_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table participanttype
-- ----------------------------
ALTER TABLE "public"."participanttype" ADD CONSTRAINT "participanttype_pkey" PRIMARY KEY ("id");
