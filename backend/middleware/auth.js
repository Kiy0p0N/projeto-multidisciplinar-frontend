// middleware/auth.js

/**
 * Middleware para proteger rotas que exigem autenticação.
 * Verifica se o usuário está autenticado via Passport (req.isAuthenticated).
 * Se autenticado, permite o acesso à próxima função; caso contrário, retorna erro 401.
 *
 * Uso: aplicar este middleware nas rotas que precisam de usuário logado.
 */
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Usuário não autenticado" });
};
