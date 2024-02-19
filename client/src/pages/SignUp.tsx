import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

import { getAuth, createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { API_URL } from '../config';
import axios from "axios";

const api = axios.create({
  baseURL: API_URL
});

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  // ユーザー登録処理
  const handleSignUp = async () => {
    if (password !== passwordConfirmation) {
      alert("パスワードとパスワード（確認）が一致しません");
      return;
    }

    const auth = getAuth();
    try {
      const userCrediential = await createUserWithEmailAndPassword(auth, email, password)
      // ユーザー登録が完了

      const token = await getIdToken(userCrediential.user);
      // api通信
      const name = '';
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      await api.post('/api/v1/users', { name: name }, { headers: headers });

      // ホーム画面(現状はウェルカムページ)に遷移
      navigate('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-72 bg-white rounded-md shadow-lg p-6">
        <form className="login">
          <fieldset>
            <legend className="bg-orange-500 text-white px-6 py-3 text-lg rounded-t-md">SignUp</legend>

            <div className="mb-4">
              <div className="relative">
                <input
                  className="w-full p-2 border rounded-md transition-colors duration-200 focus:outline-none focus:border-orange-500"
                  name="email"
                  type="email"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  className="w-full p-2 border rounded-md transition-colors duration-200 focus:outline-none focus:border-orange-500"
                  name="password"
                  type="password"
                  placeholder="パスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  className="w-full p-2 border rounded-md transition-colors duration-200 focus:outline-none focus:border-orange-500"
                  name="passwordConfirmation"
                  type="password"
                  placeholder="パスワード（確認用）"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                className="submit block mx-auto bg-orange-500 text-white rounded-full w-12 h-12 text-2xl cursor-pointer transition-all duration-200 hover:bg-orange-600 focus:outline-none focus:border-orange-600 focus:shadow-outline-orange"
                onClick={handleSignUp}
              >
                新規登録
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
