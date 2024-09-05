import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../elements/LoginForm";
import SignupForm from "../elements/SignupFrom";
import { UserContext } from "../providers/UserProvider"; // Corriger le chemin d'importation

export default function Auth() {
  const [isLogin, setIsLogin] = React.useState(true);
  const { user } = useContext(UserContext); // Assurez-vous que 'UserContext' est utilisé correctement
  const navigate = useNavigate(); // Notez que la fonction 'navigate' est nommée correctement ici

  React.useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]); // Ajoutez user et navigate comme dépendances

  const toggleIsLogin = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      {isLogin ? <LoginForm /> : <SignupForm />}
      <p
        className="text-blue-700 underline cursor-pointer p-4 text-center"
        onClick={toggleIsLogin}
      >
        {isLogin
          ? "Pas encore membre? Inscrivez-vous"
          : "Déjà membre? Connectez-vous"}
      </p>
    </div>
  );
}
