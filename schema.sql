CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  serie VARCHAR(1) NOT NULL,
  officer_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  data JSONB NOT NULL
);

CREATE INDEX idx_reports_date ON reports(date);
CREATE INDEX idx_reports_serie ON reports(serie);
CREATE INDEX idx_reports_officer ON reports(officer_id);
