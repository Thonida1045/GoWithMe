// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-green-300">
            <div className="bg-white/90 rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center">
                <Head title="Email verification" />
                <h2 className="text-2xl font-bold text-green-900 mb-2">Verify email</h2>
                <p className="text-green-800 mb-6 text-center">Please verify your email address by clicking on the link we just emailed to you.</p>
                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 rounded-lg px-4 py-2">
                        A new verification link has been sent to the email address you provided during registration.
                    </div>
                )}
                <form onSubmit={submit} className="space-y-6 w-full text-center">
                    <Button disabled={processing} variant="secondary" className="w-full rounded-full py-3 text-lg font-semibold bg-green-600 text-white hover:bg-green-700">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Resend verification email
                    </Button>
                    <TextLink href={route('logout')} method="post" className="mx-auto block text-sm text-green-700 underline">
                        Log out
                    </TextLink>
                </form>
            </div>
        </div>
    );
}
