function RegisterContent() {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("RegisterContent - isAuthenticated:", isAuthenticated);
    console.log("RegisterContent - loading:", loading);

    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p>Already authenticated. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <RegisterForm />
    </div>
  );
}