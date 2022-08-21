import { FormEventHandler, useState } from "react";
import { Button, Center, FormControl, FormLabel, IconButton, Input, InputGroup, InputRightElement, useToast, VStack } from "@chakra-ui/react";
import { supabase as supabaseClient } from "../../../lib/supabase-client";
import { supabase as supabaseServer } from "../../../lib/supabase-server";
import { useRouter } from "next/router";
import axios from "axios";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { GetServerSideProps } from "next";

const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { push } = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error, session } = await supabaseClient.auth.signIn({ email, password });
            if (!error) {
                try {
                    await axios.post("/api/auth", { event: "SIGNED_IN", session });
                    push("/admin");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                toast({
                    title: "Internal Error",
                    description: error.message,
                    position: "top",
                    status: "error",
                    isClosable: true,
                });
            }
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <Center h="100vh">
            <form onSubmit={handleSubmit}>
                <VStack w={300} spacing={3}>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <InputGroup>
                            <Input type="email" borderColor="teal" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                        </InputGroup>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input type={show ? "text" : "password"} borderColor="teal" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                            <InputRightElement>
                                <IconButton size="sm" colorScheme="teal" aria-label="Show Password" icon={show ? <BsFillEyeSlashFill /> : <BsFillEyeFill />} onClick={() => setShow(!show)} />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <Button type="submit" w="100%" colorScheme="teal" isLoading={loading}>
                        Log In
                    </Button>
                </VStack>
            </form>
        </Center>
    );
};

export default AdminLoginPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    try {
        const { user } = await supabaseServer.auth.api.getUserByCookie(req);
        if (user) return { redirect: { destination: "/admin", permanent: false } };
        return { props: {} };
    } catch (err) {
        return { props: {} };
    }
};
