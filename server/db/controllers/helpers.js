import _ from 'lodash';

function isReversimTeamMember(loggedInUser) {
  return loggedInUser && loggedInUser.isReversimTeamMember;
}

export function transformUser(user, loggedInUser) {
  if (user._doc) {
    user = user._doc;
  }

  const isTeamMember = isReversimTeamMember(loggedInUser);
  const isLoggedInUser = loggedInUser && (String(loggedInUser._id) === String(user._id));
  const canViewPrivate = isTeamMember || isLoggedInUser;

  if (_.isObject(user)) {
    return {
      _id: String(user._id),
      proposals: user.proposals && user.proposals.map(p => String(p)),
      name: user.name,
      oneLiner: user.oneLiner,
      email: canViewPrivate && user.email,
      trackRecord: canViewPrivate && user.trackRecord,
      isReversimTeamMember: user.isReversimTeamMember,
      bio: user.bio,
      gender: user.gender,
      picture: user.picture,
      linkedin: user.linkedin,
      twitter: user.twitter,
      stackOverflow: user.stackOverflow,
      github: user.github,
      phone: canViewPrivate && user.phone,
      video_url: canViewPrivate ? user.video_url : undefined,
    };
  }

  return user;
}

export function transformProposal(proposal, loggedInUser) {

  if (_.isObject(proposal)) {
    const isTeamMember = isReversimTeamMember(loggedInUser);
    const isAuthor =  loggedInUser && proposal.speaker_ids && proposal.speaker_ids.some(speakerId => String(speakerId) === String(loggedInUser._id));
    const canViewPrivate = isTeamMember || isAuthor;

    let attended;
    if (proposal.attendees && loggedInUser) {
      attended = proposal.attendees.indexOf(loggedInUser._id) > -1 ? true : undefined;
      if (!attended) {
        attended = proposal.notAttendees.indexOf(loggedInUser._id) > -1 ? false : undefined;
      }
    }
    // console.log("transformProposal, proposal id=" + proposal.id, 'speaker_ids ' + proposal.speaker_ids); // DELETE WHEN DONE

    return {
      _id: String(proposal._id),
      title: proposal.title,
      abstract: proposal.abstract,
      type: proposal.type,
      tags: proposal.tags,
      status: canViewPrivate ? proposal.status : undefined,
      speaker_ids: proposal.speaker_ids,
      startTime: proposal.startTime,
      endTime: proposal.endTime,
      hall: proposal.hall,
      slides_gdrive_id: proposal.slides_gdrive_id,
      categories: proposal.categories,
      outline: canViewPrivate ? proposal.outline : undefined,
      total: (proposal.attendees && canViewPrivate) ? proposal.attendees.length : undefined,
      attended,
      legal: canViewPrivate && proposal.legal,
    }
  }

  return proposal;
}

export default {
  transformUser,
  transformProposal
};
