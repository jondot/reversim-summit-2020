import React, { Component } from "react";
import styled from 'styled-components';
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

import {
  Container,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal
} from "reactstrap";

import {
  ResponsiveContainer,
  Heading2,
  Heading4,

} from './GlobalStyledComponents/ReversimStyledComps'
import Page from "./Page";
import { getHref, key } from "../utils";
import Tag from "./Tag";
import SessionPageRoute from "./SessionPageRoute";
import SessionDayTime from "./SessionDayTime";
import VoteButton from "./VoteButton";
import {image} from '../images';
import SessionInfo from "./SessionInfo";
import mediaQueryMin from "../styles/MediaQueriesMixin";

library.add(faPencilAlt, faTrash);

//styled-components components

const ContentContainer = styled(ResponsiveContainer)`
  ${({ theme: { space } }) => `
    padding: 0 ${space.l};
  `}
  ${mediaQueryMin.m`
    ${({ theme: { space } }) => `
      margin: ${space.xl} ${space.xl} 0 ${space.xl};
    `}
  `}
  ${mediaQueryMin.xxl`
    margin: 0 auto;
  `}
`;

const SessionPageHero = styled.div`
  ${({ theme: { space, color } }) => `
    padding: calc(12 * ${space.m}) 0 calc(3 * ${space.m}) 0;
    background: ${color.background_2};
  `}
  ${mediaQueryMin.m`
    ${({ theme: { space } }) => `
      margin: 0 auto;
      padding: calc(18.5 * ${space.m}) 0 calc(6.5 * ${space.m}) 0;
    `}
  `}
`;

const HeroHeading = styled(Heading2)`
  ${({ theme: { color } }) => `
    margin-right: 0;  
    color: ${color.text_1};
  `}
  ${mediaQueryMin.l`
    white-space: initial;
  `}
`;

const SessionStatandEdit = styled.div`
  ${({ theme: { space } }) => `
  margin-bottom: ${space.m};
  display: flex;
  justify-content: center;
  `}
`;

const SessionStatus = styled(Heading4)`
  ${({ theme: { color, font } }) => `
    color: ${color.text_3};
    font-weight: ${font.weight_bold};
  `}
`;

//React component
class SessionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDelete: false
    };
  }
  askDelete = () => {
    this.setState({ isDelete: true });
    // await props.updateProposal(proposalId, {status:'deleted'});
  };
  toggleDeleteModal = () => {
    this.setState({ isDelete: false });
  };
  deleteProposal = async () => {
    this.setState({ isDelete: false });
    await this.props.updateProposal(getHref(this.props.session), {
      status: "deleted"
    });
    this.props.history.goBack(1);
  };

  render() {
    const {
      user,
      session,
      sessionSpeakers,
      attendProposal,
      eventConfig,
      match: {
        params: { id }
      }
     } = this.props;

    const { voting, cfp, moderationCompleted } = eventConfig;

    const {
      title,
      abstract,
      type,
      tags,
      outline,
      categories: _categories,
      attende,
      speaker_ids,
      attended
    } = session;

    const trackRecords = sessionSpeakers.map(speaker => ({
      name: speaker.name,
      trackRecord: speaker.trackRecord
    }));

    const video_urls = sessionSpeakers.map(speaker => ({
      name: speaker.name,
      video_url: speaker.video_url
    }));

    const isAuthor = user && session.speaker_ids.includes(user._id);
    
    const isTeamMember = user && user.isReversimTeamMember;
    // const editPeriod = cfp || moderationCompleted;
    // TODO: NETA- remove the always true
    const editPeriod = true;
    
    const canEdit = (isAuthor && editPeriod) || isTeamMember;
    
    const canSeeStatus = (isAuthor || isTeamMember) && moderationCompleted;

    return (
      <Page title={session.title} {...this.props} isSingleContent={true}>
        <SessionPageHero>
          <ContentContainer>
            <HeroHeading>
              {title}
            </HeroHeading>
          </ContentContainer>
        </SessionPageHero>
        
        <ContentContainer>
          <div className="mb-5">
            <p>{session.proposalType} </p>
            <SessionInfo session={session} size="md" className="SessionInfo"/> {/*NOTE: GET BACK TO IT responsible for the type and Tags above the edit icon*/}
            {/* <div className="d-flex">{tags.map(Tag)}</div> */}
            <div>
              <SessionDayTime id={id} className="DayTime"/>  {/*NOTE: GET BACK TO IT responsible for the day and time above the edit icon*/}
            </div>
          </div>

          <SessionStatandEdit>

            {canSeeStatus && (
              <SessionStatus>
                Status:
                {session.status === "accepted" ? " Accepted" : " Sadly not this time"}
              </SessionStatus>
            )}
            
            {/* Stopped here */}
            {canEdit && (
              <Link
                className="unstyled-link"
                to={`/session/${getHref(session)}/edit`}
              >
                <Button
                  size="sm"
                  className="ml-3 styled-button btn btn-secondary"
                >
                  <FontAwesomeIcon icon="pencil-alt" />
                </Button>
              </Link>
            )}
          </SessionStatandEdit>

          <div className="font-size-md mb-12">
            <ReactMarkdown source={abstract} />
          </div>
          {outline && (
            <div className='text-break'>
              <h4>???</h4>
              <ReactMarkdown source={outline.replace(/\n/g, "<br/>\n")} />{" "}
              {/* consolidate line breaks */}
            </div>
          )}
          {isTeamMember &&
            trackRecords &&
            trackRecords.map((trackRecord, i) => (
              <div className="mb-3" key={i}>
                <h4>Track record- {trackRecord.name}</h4>
                <div className="font-size-sm">
                  <ReactMarkdown source={trackRecord.trackRecord} />
                </div>
              </div>
            ))}
          {isTeamMember &&
            video_urls &&
            video_urls.map((video_url, i) => (
              <div className="mb-3" key={i}>
                <h4>Video URL- {video_url.name}</h4>
                <div>
                  <a href={video_url.video_url} target="_blank">
                    {video_url.video_url}
                  </a>
                </div>
              </div>
            ))}

          <div className="session-page__voting mb-10">
            {voting && (
              <VoteButton
                user={user}
                attended={attended}
                proposalId={id}
                attendProposal={attendProposal}
                eventConfig={eventConfig}
              />
            )}
          </div>
          <div className="session-page__speakers">
            {sessionSpeakers.map(speaker => (
              <div
                className="b-strong session-page__speaker-box mb-8 d-flex"
                key={key()}
              >
                <div
                  className="session-page__speaker"
                  style={{ backgroundImage: `url('${image(speaker.picture, 236, 240)}')` }}
                />
                <div className="p-5 d-flex flex-column flex-grow-1">
                  <h4 className="font-weight-bold font-size-lg">
                    {speaker.name}
                  </h4>
                  <div className="flex-grow-1 d-flex justify-content-end align-items-end">
                    <Link
                      key={speaker._id}
                      to={`/speaker/${getHref(speaker)}`}
                      className="unstyled-link"
                    >
                      <Button className="styled-button mobile-height-auto">Read more</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/*{canEdit && (*/}
          {/*  <Button*/}
          {/*    color="primary"*/}
          {/*    size="sm"*/}
          {/*    className="ml-3"*/}
          {/*    onClick={this.askDelete}*/}
          {/*  >*/}
          {/*    <FontAwesomeIcon icon="trash" />*/}
          {/*  </Button>*/}
          {/*)}*/}
        </ContentContainer>
        {/* NOTE: couldn't get the Modal to be shown */}
        <Modal isOpen={!!this.state.isDelete} toggle={this.toggleDeleteModal}>
          <ModalBody>
            <p>are you sure you want to delete this proposal?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.deleteProposal}>
              Yes, Delete
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Page>
    );
  }
}

export default SessionPageRoute(SessionPage);
