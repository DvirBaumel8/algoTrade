CREATE TABLE IF NOT EXISTS "stocks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "symbol" varchar(20) NOT NULL UNIQUE,
  "name" varchar(255),
  "exchange" varchar(50),
  "tradable" boolean DEFAULT true,
  "last_updated" timestamp DEFAULT now()
);
