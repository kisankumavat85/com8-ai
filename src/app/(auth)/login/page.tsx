const SignInPage = () => {
  return (
    <>
      <h1>Sign in</h1>
      <a href="/api/login/github">Sign in with GitHub</a>
      <div>
        <a href="/api/auth/github">New GitHub</a>
      </div>
      <div>
        <a href="/api/auth/google">New Google</a>
      </div>
      <div>
        <a href="/api/auth/">New no provider</a>
      </div>
    </>
  );
};

export default SignInPage;
