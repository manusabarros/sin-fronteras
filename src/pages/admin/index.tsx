import { Box, Button, Text } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { supabase as supabaseClient } from "../../lib/supabase-client";
import { supabase as supabaseServer } from "../../lib/supabase-server";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";

const AdminPage: NextPage<{ user: User }> = ({ user }) => {
    const { push } = useRouter();

    const logOut = () => supabaseClient.auth.signOut().then(() => push("/admin/login"));

    return (
        <Box>
            <Text>AdminPage</Text>
            <Text>{user.email}</Text>
            <Button colorScheme="teal" onClick={logOut}>
                Log Out
            </Button>
        </Box>
    );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    try {
        const { user } = await supabaseServer.auth.api.getUserByCookie(req);
        if (user) return { props: { user } };
        return { props: {}, redirect: { destination: "/admin/login", permanent: false } };
    } catch (err) {
        return { props: {}, redirect: { destination: "/admin/login", permanent: false } };
    }
};
