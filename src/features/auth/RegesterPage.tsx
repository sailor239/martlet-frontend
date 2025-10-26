import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../../services/api";
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Alert,
  Group,
} from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerApi(username, email, password);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <Container size={420} my={80}>
      <Paper shadow="md" p="xl" radius="md" w={400}>
        <Title order={2} ta="center" mb="md">
          Create an Account
        </Title>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            mb="md"
            variant="light"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            icon={<IconCheck size={16} />}
            color="green"
            mb="md"
            variant="light"
          >
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
            <PasswordInput
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth mt="sm">
              Register
            </Button>
          </Stack>
        </form>

        <Group justify="center" mt="md">
          <Text size="sm" c="dimmed">
            Already have an account?{" "}
            <Text component={Link} to="/login" c="blue" fw={500}>
              Login here
            </Text>
          </Text>
        </Group>
      </Paper>
    </Container>
  );
}
