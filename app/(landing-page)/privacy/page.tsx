/* eslint-disable react/no-unescaped-entities */
import React from "react";

export default function PrivacyPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Privacy Policy
        </h1>

        <p className="text-center text-gray-700 mb-6 font-bold">
          Effective Date: May 31, 2024
        </p>

        <div className="space-y-4">
          <p>
            This Privacy Policy explains how Interview Pilot AI ("we", "us",
            "our") collects, uses, and discloses information about you when you
            use our website, software, services, and other offerings
            (collectively, "Services").
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, subscribe to our Services, fill out a form, or
            communicate with us. This information may include your name, email
            address, payment information, and any other details you choose to
            provide.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            Information We Collect Automatically
          </h2>
          <p>
            When you access or use our Services, we automatically collect
            information about you, including:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li>
              Log Information: We collect log information about your use of the
              Services, including your browser type, access times, pages viewed,
              IP address, and the page you visited before navigating to our
              Services.
            </li>
            <li>
              Device Information: We collect information about the computer or
              mobile device you use to access our Services, including the
              hardware model, operating system and version, unique device
              identifiers, and mobile network information.
            </li>
            <li>
              Usage Information: We collect information about your use of our
              Services, such as the features you use, the pages you visit, and
              the actions you take.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800">
            How We Use Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Provide, maintain, and improve our Services;</li>
            <li>
              Process transactions and send you related information, including
              purchase confirmations and invoices;
            </li>
            <li>
              Send you technical notices, updates, security alerts, and support
              and administrative messages;
            </li>
            <li>
              Respond to your comments, questions, and requests, and provide
              customer service;
            </li>
            <li>
              Communicate with you about products, services, offers, and events
              offered by Interview Pilot AI and others, and provide news and
              information we think will be of interest to you;
            </li>
            <li>
              Monitor and analyze trends, usage, and activities in connection
              with our Services;
            </li>
            <li>
              Detect, investigate, and prevent fraudulent transactions and other
              illegal activities and protect the rights and property of
              Interview Pilot AI and others;
            </li>
            <li>
              Personalize and improve the Services and provide advertisements,
              content, or features that match user profiles or interests;
            </li>
            <li>
              Facilitate contests, sweepstakes, and promotions, and process and
              deliver entries and rewards;
            </li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800">
            Sharing of Information
          </h2>
          <p>
            We may share information about you as follows or as otherwise
            described in this Privacy Policy:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li>
              With vendors, consultants, and other service providers who need
              access to such information to carry out work on our behalf;
            </li>
            <li>
              In response to a request for information if we believe disclosure
              is in accordance with, or required by, any applicable law,
              regulation, or legal process;
            </li>
            <li>
              If we believe your actions are inconsistent with our user
              agreements or policies, or to protect the rights, property, and
              safety of Interview Pilot AI or others;
            </li>
            <li>
              In connection with, or during negotiations of, any merger, sale of
              company assets, financing, or acquisition of all or a portion of
              our business to another company;
            </li>
            <li>With your consent or at your direction.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800">Your Choices</h2>
          <p>You have certain choices regarding your information:</p>
          <ul className="list-disc list-inside pl-4">
            <li>
              Account Information: You may update or correct information about
              you at any time by logging into your account or contacting us. If
              you wish to delete your account, please contact us, but note that
              we may retain certain information as required by law or for
              legitimate business purposes.
            </li>
            <li>
              Cookies: Most web browsers are set to accept cookies by default.
              If you prefer, you can usually choose to set your browser to
              remove or reject browser cookies. However, doing so could affect
              the availability and functionality of our Services.
            </li>
            <li>
              Promotional Communications: You may opt out of receiving
              promotional communications from us by following the instructions
              in those communications or by contacting us. If you opt out, we
              may still send you non-promotional communications, such as those
              about your account or our ongoing business relations.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:{" "}
            <a
              href="mailto:hi@interviewpilot.ai"
              className="text-blue-500 underline"
            >
              hi@interviewpilot.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
