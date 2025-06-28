// utils/multerConfig.js
import multer from 'multer';
import path from 'path';

// Configuração de storage para salvar os arquivos na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // pegar extensão original
    const filename = `${file.fieldname}-${Date.now()}${ext}`; // ex: image-1651234567890.png
    cb(null, filename);
  },
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem (jpeg, jpg, png) são permitidos'));
  }
};

// Limite do tamanho do arquivo (exemplo: 5MB)
const limits = {
  fileSize: 5 * 1024 * 1024,
};

// Exporta o middleware multer configurado
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
