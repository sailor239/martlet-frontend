import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Stack,
} from "@mantine/core";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      navigate("/"); // redirect after login
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Paper p="xl" radius="md" shadow="lg">
        <Title order={2} ta="center" mb="md">
          Welcome Back
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          Please login to continue
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Username"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
            {error && <Text c="red" size="sm">{error}</Text>}
            <Button type="submit" fullWidth loading={loading}>
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
