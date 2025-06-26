-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  accepted_terms BOOLEAN NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para informações adicionais dos pacientes
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  birth_date DATE NOT NULL,
  phone VARCHAR(20),
  gender VARCHAR(50),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para informações sobre a instituição
CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    image_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para informações sobre o médico
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    institution_id INTEGER NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    available_days TEXT[] NOT NULL,
    schedule JSONB NOT NULL,
    image_path TEXT,
    user_id INTEGER UNIQUE NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
);

-- Tabela com os agendamentos
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    institution_id INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'agendada', -- Ex.: agendada, concluída, cancelada
    notes TEXT, -- Anotações opcionais sobre a consulta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- O campo updated_at se atualiza automaticamente sempre que a linha for modificada
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela das mensagens
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

