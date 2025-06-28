// controllers/user.controller.js

/**
 * Retorna os dados do usuário logado a partir do objeto 'req.user',
 * que deve estar preenchido após autenticação (ex: via Passport).
 * Caso não haja usuário autenticado, retorna erro 401.
 */
export const getLoggedUser = (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "Usuário não autenticado" });
  }
};
