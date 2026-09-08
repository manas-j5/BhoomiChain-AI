-- Create PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Cases Table
CREATE TABLE IF NOT EXISTS cases (
    case_id VARCHAR(100) PRIMARY KEY,
    case_name TEXT,
    state VARCHAR(100),
    district VARCHAR(100),
    tehsil VARCHAR(100),
    village VARCHAR(100),
    khasra_no VARCHAR(100),
    survey_no VARCHAR(100),
    parcel_type VARCHAR(50),
    area VARCHAR(100),
    dispute_type VARCHAR(100),
    dispute_start_year VARCHAR(10),
    current_status TEXT,
    court VARCHAR(200),
    case_number VARCHAR(100),
    ulpin VARCHAR(100),
    current_ror VARCHAR(50),
    cadastral_map VARCHAR(50),
    registration_record VARCHAR(50),
    court_documents VARCHAR(50),
    satellite_data VARCHAR(50),
    news_articles VARCHAR(50),
    research_papers VARCHAR(50),
    evidence_score NUMERIC(4,2),
    source_count INTEGER,
    case_type VARCHAR(200),
    verification_level VARCHAR(100),
    conflict_flag BOOLEAN,
    conflict_description TEXT,
    last_verified_date DATE,
    data_version NUMERIC(4,1),
    remarks TEXT
);

-- 2. Parcels Table (Spatial)
CREATE TABLE IF NOT EXISTS parcels (
    parcel_id VARCHAR(100) PRIMARY KEY,
    case_id VARCHAR(100) REFERENCES cases(case_id),
    geometry geometry(Geometry, 4326),
    geometry_source VARCHAR(100),
    survey_map VARCHAR(100),
    joint_verification_status VARCHAR(100),
    settlement_status VARCHAR(100)
);

-- 3. Khata Records Table (Delhi Prototype)
CREATE TABLE IF NOT EXISTS khata_records (
    khata_record_id VARCHAR(100) PRIMARY KEY,
    holding_id VARCHAR(100),
    land_id VARCHAR(100),
    rect_no VARCHAR(50),
    khasra_no VARCHAR(100),
    area_raw NUMERIC(10,2),
    area_unit VARCHAR(50),
    remarks TEXT,
    data_status VARCHAR(50),
    verification_status VARCHAR(50),
    source_name VARCHAR(200),
    source_url TEXT,
    created_at DATE
);

-- 4. Khata Owners Table
CREATE TABLE IF NOT EXISTS khata_owners (
    khata_owner_id VARCHAR(100) PRIMARY KEY,
    khata_record_id VARCHAR(100) REFERENCES khata_records(khata_record_id),
    owner_name VARCHAR(200),
    owner_share VARCHAR(50),
    data_status VARCHAR(50),
    verification_status VARCHAR(50),
    source_name VARCHAR(200),
    source_url TEXT,
    created_at DATE
);

-- 5. Evidence Table
CREATE TABLE IF NOT EXISTS evidence (
    evidence_id VARCHAR(100) PRIMARY KEY,
    case_id VARCHAR(100),
    parcel_id VARCHAR(100),
    land_id VARCHAR(100),
    source_type VARCHAR(100),
    source_name TEXT,
    source_authority VARCHAR(200),
    source_url TEXT,
    document_date DATE,
    retrieval_date DATE,
    field_extracted VARCHAR(100),
    extracted_value TEXT,
    page_number VARCHAR(100),
    verification_status VARCHAR(100),
    confidence NUMERIC(4,2),
    notes TEXT,
    data_status VARCHAR(50),
    created_at DATE
);
