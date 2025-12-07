<!-- src/routes/privacy-policy/+page.svelte -->
<svelte:head>
  <title>Privacy Policy - Nanowrit Labs, Inc.</title>
  <meta
    name="description"
    content="Privacy Policy for Nanowrit Labs, Inc. Learn how we collect, use, and share your personal information."
  />
</svelte:head>

<div class="font-sans">
  <main class="max-w-4xl mx-auto py-12 px-6 lg:px-8">
    <div class="p-8 md:p-12">
      <header class="text-center border-b pb-6 mb-8">
        <h1 class="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
        <p class="text-md mt-2">Last updated: March 31, 2025</p>
      </header>

      <section class="mb-8">
        <p>
          This Privacy Notice for <strong>Nanowrit Labs, Inc</strong> ("we," "us,"
          or "our"), describes how and why we might access, collect, store, use, and/or
          share ("process") your personal information when you use our services ("Services"),
          including when you:
        </p>
        <ul class="list-disc list-inside my-4 pl-4 space-y-2">
          <li>
            Visit our website at <a
              href="https://nanowritlabs.com"
              class="hover:underline">https://nanowritlabs.com</a
            >, or any website of ours that links to this Privacy Notice.
          </li>
          <li>
            Engage with us in other related ways, including any sales,
            marketing, or events.
          </li>
        </ul>
        <p>
          <strong>Questions or concerns?</strong> Reading this Privacy Notice
          will help you understand your privacy rights and choices. We are
          responsible for making decisions about how your personal information
          is processed. If you do not agree with our policies and practices,
          please do not use our Services. If you still have any questions or
          concerns, please contact us at
          <a href="mailto:privacy@nanowritlabs.com" class="hover:underline"
            >privacy@nanowritlabs.com</a
          >.
        </p>
      </section>

      <section class="mb-10 p-6 rounded-lg">
        <h2 class="text-2xl font-semibold mb-4">Summary of Key Points</h2>
        <p class="mb-4">
          This summary provides key points from our Privacy Notice, but you can
          find out more details about any of these topics by using our table of
          contents below to find the section you are looking for.
        </p>
        <ul class="space-y-3">
          <li>
            <strong>What personal information do we process?</strong> When you visit,
            use, or navigate our Services, we may process personal information depending
            on how you interact with us and the Services, the choices you make, and
            the products and features you use.
          </li>
          <li>
            <strong>Do we process any sensitive personal information?</strong> We
            do not process sensitive personal information.
          </li>
          <li>
            <strong>Do we collect any information from third parties?</strong> We
            do not collect any information from third parties.
          </li>
          <li>
            <strong>How do we process your information?</strong> We process your information
            to provide, improve, and administer our Services, communicate with you,
            for security and fraud prevention, and to comply with law.
          </li>
          <li>
            <strong
              >In what situations and with which parties do we share personal
              information?</strong
            > We may share information in specific situations and with specific categories
            of third parties.
          </li>
          <li>
            <strong>How do we keep your information safe?</strong> We have organizational
            and technical processes in place to protect your personal information.
            However, no electronic transmission can be guaranteed to be 100% secure.
          </li>
          <li>
            <strong>What are your rights?</strong> Depending on your location, you
            may have certain rights regarding your personal information.
          </li>
          <li>
            <strong>How do you exercise your rights?</strong> The easiest way is by
            submitting a data subject access request or by contacting us.
          </li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-2xl font-semibold mb-4" id="toc">Table of Contents</h2>
        <ol class="list-decimal list-inside space-y-2">
          <li>
            <a href="#what-info" class="hover:underline"
              >What Information Do We Collect?</a
            >
          </li>
          <li>
            <a href="#how-process" class="hover:underline"
              >How Do We Process Your Information?</a
            >
          </li>
          <li>
            <a href="#legal-bases" class="hover:underline"
              >What Legal Bases Do We Rely On to Process Your Personal
              Information?</a
            >
          </li>
          <li>
            <a href="#when-share" class="hover:underline"
              >When and With Whom Do We Share Your Personal Information?</a
            >
          </li>
          <li>
            <a href="#cookies" class="hover:underline"
              >Do We Use Cookies and Other Tracking Technologies?</a
            >
          </li>
          <li>
            <a href="#social-logins" class="hover:underline"
              >How Do We Handle Your Social Logins?</a
            >
          </li>
          <li>
            <a href="#how-long" class="hover:underline"
              >How Long Do We Keep Your Information?</a
            >
          </li>
          <li>
            <a href="#how-safe" class="hover:underline"
              >How Do We Keep Your Information Safe?</a
            >
          </li>
          <li>
            <a href="#minors" class="hover:underline"
              >Do We Collect Information From Minors?</a
            >
          </li>
          <li>
            <a href="#privacy-rights" class="hover:underline"
              >What Are Your Privacy Rights?</a
            >
          </li>
          <li>
            <a href="#dnt" class="hover:underline"
              >Controls for Do-Not-Track Features</a
            >
          </li>
          <li>
            <a href="#us-rights" class="hover:underline"
              >Do United States Residents Have Specific Privacy Rights?</a
            >
          </li>
          <li>
            <a href="#updates" class="hover:underline"
              >Do We Make Updates to This Notice?</a
            >
          </li>
          <li>
            <a href="#contact" class="hover:underline"
              >How Can You Contact Us About This Notice?</a
            >
          </li>
          <li>
            <a href="#review-data" class="hover:underline"
              >How Can You Review, Update, or Delete the Data We Collect From
              You?</a
            >
          </li>
        </ol>
      </section>

      <!-- Detailed Sections -->
      <div class="space-y-10 leading-relaxed">
        <section id="what-info">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            1. What Information Do We Collect?
          </h2>
          <h3 class="text-xl font-semibold mt-6 mb-3">
            Personal information you disclose to us
          </h3>
          <p>
            <strong>In Short:</strong> We collect personal information that you provide
            to us.
          </p>
          <p>
            We collect personal information that you voluntarily provide to us
            when you register on the Services, express an interest in obtaining
            information about us or our products and Services, when you
            participate in activities on the Services, or otherwise when you
            contact us.
          </p>
          <p>
            <strong>Personal Information Provided by You.</strong> The personal information
            that we collect depends on the context of your interactions with us and
            the Services, the choices you make, and the products and features you
            use. The personal information we collect may include the following:
          </p>
          <ul class="list-disc list-inside my-4 pl-4 space-y-1">
            <li>names</li>
            <li>email addresses</li>
          </ul>
          <p>
            <strong>Sensitive Information.</strong> We do not process sensitive information.
          </p>
          <p>
            <strong>Payment Data.</strong> We may collect data necessary to
            process your payment if you choose to make purchases, such as your
            payment instrument number, and the security code associated with
            your payment instrument. All payment data is handled and stored by
            Stripe. You may find their privacy notice link(s) here:
            <a href="https://stripe.com/privacy" class="hover:underline"
              >https://stripe.com/privacy</a
            >.
          </p>
          <p>
            <strong>Social Media Login Data.</strong> We may provide you with
            the option to register with us using your existing social media
            account details, like your Facebook, X, or other social media
            account. If you choose to register in this way, we will collect
            certain profile information about you from the social media
            provider, as described in the section called
            <a href="#social-logins" class="hover:underline"
              >"How Do We Handle Your Social Logins?"</a
            > below.
          </p>
          <p>
            All personal information that you provide to us must be true,
            complete, and accurate, and you must notify us of any changes to
            such personal information.
          </p>

          <h3 class="text-xl font-semibold mt-6 mb-3">
            Information automatically collected
          </h3>
          <p>
            <strong>In Short:</strong> Some information — such as your Internet Protocol
            (IP) address and/or browser and device characteristics — is collected
            automatically when you visit our Services.
          </p>
          <p>
            We automatically collect certain information when you visit, use, or
            navigate the Services. This information does not reveal your
            specific identity (like your name or contact information) but may
            include device and usage information, such as your IP address,
            browser and device characteristics, operating system, language
            preferences, referring URLs, device name, country, location,
            information about how and when you use our Services, and other
            technical information. This information is primarily needed to
            maintain the security and operation of our Services, and for our
            internal analytics and reporting purposes.
          </p>
          <p>The information we collect includes:</p>
          <ul class="list-disc list-inside my-4 pl-4 space-y-2">
            <li>
              <strong>Log and Usage Data.</strong> Log and usage data is service-related,
              diagnostic, usage, and performance information our servers automatically
              collect when you access or use our Services and which we record in log
              files.
            </li>
            <li>
              <strong>Device Data.</strong> We collect device data such as information
              about your computer, phone, tablet, or other device you use to access
              the Services.
            </li>
            <li>
              <strong>Location Data.</strong> We collect location data such as information
              about your device's location, which can be either precise or imprecise.
              You can opt out of allowing us to collect this information either by
              refusing access to the information or by disabling your Location setting
              on your device.
            </li>
          </ul>
        </section>

        <section id="how-process">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            2. How Do We Process Your Information?
          </h2>
          <p>
            <strong>In Short:</strong> We process your information to provide, improve,
            and administer our Services, communicate with you, for security and fraud
            prevention, and to comply with law. We may also process your information
            for other purposes with your consent.
          </p>
          <p>
            We process your personal information for a variety of reasons,
            depending on how you interact with our Services, including:
          </p>
          <ul class="list-disc list-inside my-4 pl-4 space-y-2">
            <li>
              To facilitate account creation and authentication and otherwise
              manage user accounts.
            </li>
            <li>To respond to user inquiries/offer support to users.</li>
            <li>To send administrative information to you.</li>
            <li>To deliver targeted advertising to you.</li>
            <li>To identify usage trends.</li>
            <li>
              To determine the effectiveness of our marketing and promotional
              campaigns.
            </li>
            <li>To save or protect an individual's vital interest.</li>
          </ul>
        </section>

        <section id="legal-bases">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            3. What Legal Bases Do We Rely On to Process Your Personal
            Information?
          </h2>
          <p>
            <strong>In Short:</strong> We only process your personal information when
            we believe it is necessary and we have a valid legal reason (i.e., legal
            basis) to do so under applicable law, like with your consent, to comply
            with laws, to provide you with services to enter into or fulfill our contractual
            obligations, to protect your rights, or to fulfill our legitimate business
            interests.
          </p>
          <p>
            We may rely on the following legal bases to process your personal
            information:
          </p>
          <ul class="list-disc list-inside my-4 pl-4 space-y-2">
            <li>
              <strong>Consent.</strong> We may process your information if you have
              given us permission (i.e., consent) to use your personal information
              for a specific purpose. You can withdraw your consent at any time.
            </li>
            <li>
              <strong>Performance of a Contract.</strong> We may process your personal
              information when we believe it is necessary to fulfill our contractual
              obligations to you.
            </li>
            <li>
              <strong>Legitimate Interests.</strong> We may process your information
              when we believe it is reasonably necessary to achieve our legitimate
              business interests.
            </li>
            <li>
              <strong>Legal Obligations.</strong> We may process your information
              where we believe it is necessary for compliance with our legal obligations.
            </li>
            <li>
              <strong>Vital Interests.</strong> We may process your information where
              we believe it is necessary to protect your vital interests or the vital
              interests of a third party.
            </li>
          </ul>
        </section>

        <section id="when-share">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            4. When and With Whom Do We Share Your Personal Information?
          </h2>
          <p>
            <strong>In Short:</strong> We may share information in specific situations
            described in this section and/or with the following categories of third
            parties.
          </p>
          <p>
            <strong
              >Vendors, Consultants, and Other Third-Party Service Providers.</strong
            > We may share your data with third-party vendors, service providers,
            contractors, or agents who perform services for us or on our behalf and
            require access to such information to do that work.
          </p>
          <p>
            We also may need to share your personal information in the following
            situations:
          </p>
          <ul class="list-disc list-inside my-4 pl-4 space-y-2">
            <li>
              <strong>Business Transfers.</strong> We may share or transfer your information
              in connection with, or during negotiations of, any merger, sale of company
              assets, financing, or acquisition of all or a portion of our business
              to another company.
            </li>
            <li>
              <strong>Affiliates.</strong> We may share your information with our
              affiliates, in which case we will require those affiliates to honor
              this Privacy Notice.
            </li>
            <li>
              <strong>Business Partners.</strong> We may share your information with
              our business partners to offer you certain products, services, or promotions.
            </li>
          </ul>
        </section>

        <section id="cookies">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            5. Do We Use Cookies and Other Tracking Technologies?
          </h2>
          <p>
            <strong>In Short:</strong> We may use cookies and other tracking technologies
            to collect and store your information. We may use cookies and similar
            tracking technologies (like web beacons and pixels) to gather information
            when you interact with our Services. Specific information about how we
            use such technologies and how you can refuse certain cookies is set out
            in our Cookie Notice.
          </p>
        </section>

        <section id="social-logins">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            6. How Do We Handle Your Social Logins?
          </h2>
          <p>
            <strong>In Short:</strong> If you choose to register or log in to our
            Services using a social media account, we may have access to certain information
            about you. Our Services offer you the ability to register and log in using
            your third-party social media account details. Where you choose to do
            this, we will receive certain profile information about you from your
            social media provider. We will use the information we receive only for
            the purposes that are described in this Privacy Notice.
          </p>
        </section>

        <section id="how-long">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            7. How Long Do We Keep Your Information?
          </h2>
          <p>
            <strong>In Short:</strong> We keep your information for as long as necessary
            to fulfill the purposes outlined in this Privacy Notice unless otherwise
            required by law. We will only keep your personal information for as long
            as it is necessary for the purposes set out in this Privacy Notice, unless
            a longer retention period is required or permitted by law. No purpose
            in this notice will require us keeping your personal information for longer
            than the period of time in which users have an account with us.
          </p>
        </section>

        <section id="how-safe">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            8. How Do We Keep Your Information Safe?
          </h2>
          <p>
            <strong>In Short:</strong> We aim to protect your personal information
            through a system of organizational and technical security measures. However,
            despite our safeguards and efforts, no electronic transmission over the
            Internet or information storage technology can be guaranteed to be 100%
            secure. Although we will do our best to protect your personal information,
            transmission of personal information to and from our Services is at your
            own risk. You should only access the Services within a secure environment.
          </p>
        </section>

        <section id="minors">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            9. Do We Collect Information From Minors?
          </h2>
          <p>
            <strong>In Short:</strong> We do not knowingly collect data from or market
            to children under 18 years of age. By using the Services, you represent
            that you are at least 18 or that you are the parent or guardian of such
            a minor and consent to such minor dependent’s use of the Services. If
            we learn that personal information from users less than 18 years of age
            has been collected, we will deactivate the account and take reasonable
            measures to promptly delete such data from our records.
          </p>
        </section>

        <section id="privacy-rights">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            10. What Are Your Privacy Rights?
          </h2>
          <p>
            <strong>In Short:</strong> Depending on your location, you have rights
            that allow you greater access to and control over your personal information.
            You may review, change, or terminate your account at any time.
          </p>
          <p>
            You can make a request by contacting us by using the contact details
            provided in the section <a href="#contact" class="hover:underline"
              >"How Can You Contact Us About This Notice?"</a
            > below.
          </p>
        </section>

        <section id="dnt">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            11. Controls for Do-Not-Track Features
          </h2>
          <p>
            Most web browsers and some mobile operating systems and mobile
            applications include a Do-Not-Track ("DNT") feature. At this stage,
            no uniform technology standard for recognizing and implementing DNT
            signals has been finalized. As such, we do not currently respond to
            DNT browser signals. California law requires us to let you know how
            we respond to web browser DNT signals. Because there currently is
            not an industry or legal standard for recognizing or honoring DNT
            signals, we do not respond to them at this time.
          </p>
        </section>

        <section id="us-rights">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            12. Do United States Residents Have Specific Privacy Rights?
          </h2>
          <p>
            <strong>In Short:</strong> If you are a resident of certain US states,
            you may have the right to request access to and receive details about
            the personal information we maintain about you, correct inaccuracies,
            get a copy of, or delete your personal information.
          </p>
          <h3 class="text-xl font-semibold mt-6 mb-3">
            Categories of Personal Information We Collect
          </h3>
          <p>
            We have collected the following categories of personal information
            in the past twelve (12) months:
          </p>
          <div class="overflow-x-auto my-6">
            <table class="min-w-full border rounded-lg">
              <thead>
                <tr>
                  <th class="text-left font-semibold py-3 px-4 border-b"
                    >Category</th
                  >
                  <th class="text-left font-semibold py-3 px-4 border-b"
                    >Examples</th
                  >
                  <th class="text-center font-semibold py-3 px-4 border-b"
                    >Collected</th
                  >
                </tr>
              </thead>
              <tbody>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium">A. Identifiers</td>
                  <td class="py-3 px-4"
                    >Contact details, IP address, email address, account name</td
                  >
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium"
                    >B. Personal information (Cal. Customer Records)</td
                  >
                  <td class="py-3 px-4"
                    >Name, contact information, employment, financial
                    information</td
                  >
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium"
                    >C. Protected classification characteristics</td
                  >
                  <td class="py-3 px-4"
                    >Gender, age, race, marital status, etc.</td
                  >
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium"
                    >D. Commercial information</td
                  >
                  <td class="py-3 px-4">Purchase history, financial details</td>
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium">E. Biometric information</td
                  >
                  <td class="py-3 px-4">Fingerprints, voiceprints</td>
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium"
                    >F. Internet or network activity</td
                  >
                  <td class="py-3 px-4"
                    >Browsing history, search history, online behavior</td
                  >
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium">G. Geolocation data</td>
                  <td class="py-3 px-4">Device location</td>
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium">H. Sensory data</td>
                  <td class="py-3 px-4"
                    >Images, audio, video or call recordings</td
                  >
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium"
                    >I. Professional or employment-related info</td
                  >
                  <td class="py-3 px-4">Job title, work history</td>
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium">J. Education Information</td
                  >
                  <td class="py-3 px-4"
                    >Student records, directory information</td
                  >
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr class="border-b">
                  <td class="py-3 px-4 font-medium"
                    >K. Inferences drawn from personal data</td
                  >
                  <td class="py-3 px-4"
                    >Profile reflecting preferences, characteristics</td
                  >
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-medium"
                    >L. Sensitive personal Information</td
                  >
                  <td class="py-3 px-4"></td>
                  <td class="py-3 px-4 text-center">NO</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 class="text-xl font-semibold mt-6 mb-3">
            How to Exercise Your Rights
          </h3>
          <p>
            To exercise these rights, you can contact us by submitting a data
            subject access request, by visiting <a
              href="https://nanowritlabs.com/contact_us"
              class="hover:underline">https://nanowritlabs.com/contact_us</a
            >, or by referring to the contact details at the bottom of this
            document.
          </p>
        </section>

        <section id="updates">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            13. Do We Make Updates to This Notice?
          </h2>
          <p>
            <strong>In Short:</strong> Yes, we will update this notice as necessary
            to stay compliant with relevant laws. We may update this Privacy Notice
            from time to time. The updated version will be indicated by an updated
            "Revised" date at the top of this Privacy Notice. We encourage you to
            review this Privacy Notice frequently to be informed of how we are protecting
            your information.
          </p>
        </section>

        <section id="contact">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            14. How Can You Contact Us About This Notice?
          </h2>
          <p>
            If you have questions or comments about this notice, you may contact
            us by post at:
          </p>
          <address class="mt-4 not-italic p-4 rounded-lg border">
            <strong>Nanowrit Labs, Inc</strong><br />
            Broomfield, CO 80020<br />
            United States
          </address>
        </section>

        <section id="review-data">
          <h2 class="text-2xl font-bold mb-4 border-b pb-2">
            15. How Can You Review, Update, or Delete the Data We Collect From
            You?
          </h2>
          <p>
            Based on the applicable laws of your country or state of residence,
            you may have the right to request access to the personal information
            we collect from you, correct inaccuracies, or delete it. To request
            to review, update, or delete your personal information, please fill
            out and submit a data subject access request.
          </p>
        </section>
      </div>
    </div>
  </main>
</div>

<style>
  /* Using a global style block for base styles */
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

  :global(body) {
    font-family: "Inter", sans-serif;
  }

  /* We can add more component-specific styles here if needed */
  /* For example, custom link styles */
  a {
    transition: color 0.2s ease-in-out;
  }
</style>
