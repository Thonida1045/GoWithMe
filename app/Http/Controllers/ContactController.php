<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid input.'], 422);
        }

        $to = env('MAIL_TO_ADDRESS', 'your-gmail@gmail.com'); // Set your Gmail in .env as MAIL_TO_ADDRESS
        $subject = 'New Contact Message from Tourism Blog';
        $body = "From: " . $request->input('email') . "\n\n" . $request->input('message');

        try {
            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)
                        ->subject($subject);
            });
            return response()->json(['message' => 'Message sent successfully.']);
        } catch (\Exception $e) {
            Log::error('Contact form failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send message.'], 500);
        }
    }
}
