import React from 'react';
import FormField from '../FormField';

export const getUserData = formElements => {
  const fullname = formElements.fullname.value;
  const oneLiner = formElements.oneLiner.value;
  const bio = formElements.bio.value;
  const trackRecord = formElements.trackRecord.value;
  const linkedin = formElements.linkedin.value;
  const twitter = formElements.twitter.value;
  const github = formElements.github.value;
  const phone = formElements.phone.value;
  const videoUrl = formElements.video_url.value;

  return {
    name: fullname,
    bio: bio,
    trackRecord: trackRecord,
    linkedin: linkedin,
    twitter: twitter,
    github: github,
    oneLiner: oneLiner,
    phone: phone,
    video_url: videoUrl,
  };
}; // NOTE: This beauty returns an Object with the user's info based on what was typed in the form

const SPACING = 'mb-6'; //NOTE: Should get rid of this

const VideoUrlFieldCaption = () => (
  <span>
    <ul>
      <li>
        <b>Seasoned speakers</b>: A link to a video of a session given in a previous conference.</li>
      <li>
        <b>New speakers</b>: A short video introducing you and the planned session outline.
        <br/>Please see <a href="https://www.youtube.com/watch?v=F09My4646hI">https://www.youtube.com/watch?v=F09My4646hI</a> for guidance
      </li>
    </ul>
    <i>
      <b>Note</b>: You may reuse this video link in the below "Track record" section.
    </i>
  </span>
);

const UserForm = ({user}) => (
  <div>
    {/* Step One */}
    <h4 className="mb-0">Public information</h4>
    <p className="font-size-sm text-gray-600">
      The following information will be presented on the website
    </p>
    <FormField
      id="fullname"
      label="Full name"
      required={true}
      placeholder="Your name"
      value={user.name}
      className={SPACING}
    />
    <FormField
      id="oneLiner"
      label="One Liner"
      value={user.oneLiner}
      maxLength={100}
      className={SPACING}
      subtitle="Maximum 100 characters"
      placeholder="COBOL developer at Acme Corp"
    />
    <FormField
      id="linkedin"
      label="Linkedin Profile"
      value={user.linkedin}
      inputType="url"
      className={SPACING}
      placeholder="https://www.linkedin.com/in/reversim/"
    />
    <FormField
      id="github"
      label="GitHub username"
      value={user.github}
      placeholder="podcaster"
      className={SPACING}
    />
    <FormField
      id="twitter"
      label="Twitter @name"
      value={user.twitter}
      placeholder="@Reversim"
      className={SPACING}
    />
    {/* StepTwo */}
    <FormField
      id="bio"
      label="Short Bio"
      value={user.bio}
      placeholder=""
      required={true}
      multiline={true}
      className="mb-8"
      subtitle={
        <span>
          Tell everybody a little bit about yourself. Useful sentences can be:<br />
          <br />
          “A front-end developer for the last X years”<br />
          “I work remotely, and interested in building remote teams and effective internal
          communication”<br />
          “I enjoy developing and using open source code”<br />
          “I participate in the Meetup X”<br />
          “I have been influenced by the book ‘The Pragmatic Programmer’”<br />
          “I have been playing with Deep Learning recently, took some online courses and eager to
          learn more!”<br />
          “I am an avid wikipedia contributor”
        </span>
      }
    />
    {/* StepThree */}
    <h4 className="mb-0">Private information</h4>
    <p className="font-size-sm text-gray-600">
      The following information will be available <b>only to the organizing committee</b>
    </p>
    <FormField id="email" label="Email" text={user.email} required={true} className={SPACING} />
    <FormField
      id="phone"
      label="Phone number"
      required={true}
      placeholder="05x-xxxxxxx"
      value={user.phone}
      className={SPACING}
    />
    <FormField
      id="video_url"
      label="Link to video"
      required={true}
      value={user.video_url}
      placeholder="e.g. http://youtu.be/xxxx"
      subtitle={<VideoUrlFieldCaption />}
      className={SPACING}
    />
    <FormField
      id="trackRecord"
      label="Track record as speaker, if available"
      value={user.trackRecord}
      placeholder=""
      required={true}
      multiline={true}
      className={SPACING}
      subtitle={
        <span>
          Reversim Summit is looking for a balance between seasonal speakers and new speakers. <br/><br/>

          Seasonal speakers should include links to presentations, most preferable videos of them (plus
          slides)<br />
          <br />
          <b>Example:</b>
          <ul>
            <li>
              ExampleCon 2017, Sweden (Keynote speaker): “Modern Fortran development with ActiveX”
              (45 minutes). Video: ,{' '}
              <a
                tabIndex="-1"
                target="_blank"
                href="https://www.youtube.com/watch?v=Nf_Y4MbUCLY"
                rel="noopener noreferrer">
                https://www.youtube.com/watch?v=Nf_Y4MbUCLY
              </a>{' '}
              slides: http://example.com/slide1
            </li>
            <li>
              EsoteriCon 2016, Tel Aviv: “How I sold my Piet program to MOMA for $20M” (20 minutes),
              Video:{' '}
              <a
                tabIndex="-1"
                target="_blank"
                href="https://youtu.be/DGXx56WqqJw"
                rel="noopener noreferrer">
                https://youtu.be/DGXx56WqqJw
              </a>, slides: http://example.com/slide2
            </li>
            <li>
              Israeli LOLCODE meetup (February 2015), Tel Aviv, “Is LOLCODE Turing complete?” (5
              minutes), Video:{' '}
              <a
                tabIndex="-1"
                target="_blank"
                href="https://www.youtube.com/watch?v=Wpx6XnankZ8"
                rel="noopener noreferrer">
                https://www.youtube.com/watch?v=Wpx6XnankZ8
              </a>, slides: http://example.com/slide3
            </li>
          </ul>
        </span>
      }
    />
    {/* StepThree is done here */}
  </div>
);

export default UserForm;
