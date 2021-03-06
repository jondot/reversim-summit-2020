import React, {Component} from 'react';
import {Button, Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import uniq from 'lodash/uniq';
import without from 'lodash/without';
import cn from 'classnames';
import {findBestMatch} from 'string-similarity';
import FormField from '../FormField';
import Tags from './Tags';
// import {titleInput} from './CFPPage.css';
import {
  ABSTRACT_MAX,
  ABSTRACT_MIN,
  PREDEFINED_TAGS,
  MAX_TAGS,
  PROPOSAL_TYPES_ARR,
  CATEGORIES,
  MAX_CATEGORIES,
} from '../../data/proposals';
// import {categories} from '../Categories.css';

const SPACING = 'mb-6'; //NOTE: Should get rid of this

const TitleFieldCaption = () => (
  <span>
    Make it descriptive, concise, and appealing. You are welcome to review{' '}
    <a href="http://summit2018.reversim.com/schedule" target="_blank" rel="noopener noreferrer">
      last year’s agenda
    </a>, or use the following examples:<br />
    <br />
    <ul>
      <li>
        <i>“How we optimized micro-service utilization using machine learning”</i>
      </li>
      <li>
        <i>“Writing on sand? Embracing CI-CD techniques in the HR team”</i>
      </li>
      <li>
        <i>“Effective Hackathon: How to re-write a project in 24 hours and save your startup”</i>
      </li>
      <li>
        <i>
          “Cost of choosing the wrong development stack: A learn-build-measure story from the
          trenches”
        </i>
      </li>
    </ul>
    Reversim Summit is about deep-tech, and we will reject trivial introductory talks in
    software-related sessions (introduction to other topics is OK).
  </span>
);

const AbstractFieldCaption = ({abstractLen, abstractErr}) => (
  <span>
    Markdown syntax is supported. You can edit your proposal at any given time during the CFP
    period.<br />
    <br />
    <b>Example:</b>
    <br />Building an effective micro-service architecture is a non-trivial task. At example.com, we
    have accumulated more than 500 different micro-services over the years, ended up with a
    micro-service spaghetti, long latency, and inevitably - a broken CI/CD pipeline. Then, we
    decided to remove human factor out of the equation. In this session I will present our
    open-sourced package that analyzed our microservice architecture as a graph, measured the load
    on each server, improved server utilization by 73% and brought our CI-CD pipeline back from the
    dead.<br />
    <br />
    <br />
    Some helpful guidance questions:
    <ul>
      <li>
        Why this topic is important?
      </li>
      <li>
        What pain points your talk aims to address?
      </li>
      <li>
        What actionable benefits / knowledge will attendees gain by attending your talk?
      </li>
    </ul>
    <br />
    <span className={cn({'text-red': abstractErr}, 'font-weight-bold')}>
      {abstractLen}/{ABSTRACT_MAX}
    </span>{' '}
    (minimum {ABSTRACT_MIN} characters)
  </span>
);

const CoSpeakerFieldCaption = () => (
  <span>
    <span>If you want to lecture with another speaker, add their email here. Both of you will be able to edit the lecture.</span><br/>
    <span className='text-red'>Make sure your co-speaker is already signed!</span>
  </span>
 );

const OutlineFieldCaption = () => (
  <div>
    <p>
    This part is only visible to the moderation team.
    The outline should include the main subjects you intend to cover with a timing estimation and
    total timing. A general overview is fine, we don’t expect a per-slide description for now.
    </p>
    <p>For example:</p>
    <ul>
      <li>&bull; 2m Introduction: Who am I and my professional background</li>
      <li>&bull; 5m Architectural overview: how we built 500 different micro-services over 5 years, and
      why we ended up supporting 15 different programming languages.</li>
      <li>&bull; 5m The latency math behind a micro-service call-chain, and why we had to over-provision
      containers to avoid a 1s response time because accumulated latency is not a normal distribution</li>
      <li>&bull; 15m Our solution: Measuring everything and using a managed machine-learning platform to
      optimize our response time and server utilization</li>
      <li>&bull; 5m: The open source power! How can you use our code to optimize your production system</li>
      <li>&bull; 5m Q&A</li>
      <li>Total time: 37m</li>
    </ul>
    <br />
    <br />
  </div>
);

const CategoryCheckbox = ({name, description, onChange, checked, disabled}) => (
  <div onClick={() => onChange(name)} className={cn({'text-primary': checked}, 'd-flex align-items-center mb-4', {'opacity-05': !disabled})}>
    <input
      className="mr-3"
      type="checkbox"
      checked={checked}
      disabled={disabled}
      readOnly={true}
    />
    <label className={cn({'text-primary': checked},'align-items-center d-flex')}>
      <div className={'d-flex flex-column'}>
        <h5 className="mb-0">{name}</h5>
        <small className={cn({'text-primary': checked})}>
          {description}
        </small>
      </div>
    </label>
  </div>
);

const CategoryOther = ({onChange, onChangeInput, checked, disabled}) => (
  <div className={cn({'text-primary': checked}, 'd-flex align-items-center mb-4', {'opacity-05': disabled})}>
    <input
      className="mr-3"
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <label className={cn({'text-primary': checked},'align-items-center d-flex')}>
      <h5 className="mb-0 mr-1">Other: </h5>
      <Input
        bsSize="sm"
        disabled={disabled}
        placeholder="lockpicking, moonwalking, etc."
        onChange={onChangeInput}
      />
    </label>
  </div>
);

class ProposalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abstractLen: props.abstract ? props.abstract.length : 0,
      abstractErr: props.abstract ? this.getAbstractErr(props.abstract) : true,
      newTagPending: null,
      otherCategory: props.categories ? this.getOtherCategoryInState(props.categories) : null,
      coSpeaker: props.coSpeaker,
    };
  }

  handleProposalTypeChange = e => {
    this.props.update({proposalType: e.target.value});
  };

  onChangeAbstract = e => {
    const val = e.target.value;
    const abstractLen = val.length;
    const abstractErr = this.getAbstractErr(val);
    this.setState({
      abstractLen,
      abstractErr,
    });
  };

  onChangeCoSpeaker = e => {
    this.props.update({coSpeaker: e.target.value});
    // this.setState({
    //   abstractLen,
    //   abstractErr,
    // });
  };

  getAbstractErr = val =>
    val.length < ABSTRACT_MIN ? 'low' : val.length > ABSTRACT_MAX ? 'high' : null;

  onAddTag = tag => {
    const {allTags, tags} = this.props;
    if (tags.indexOf(tag) > -1) {
      return;
    } else if (allTags && allTags.indexOf(tag) === -1 && PREDEFINED_TAGS.indexOf(tag) === -1) {
      this.setState({newTagPending: tag});
    } else {
      this.addTag(tag);
    }
  };

  addTag = tag => {
    const tags = this.props.tags.concat(tag);
    this.props.update({tags: tags});
  };

  onDeleteTag = i => {
    const tags = [...this.props.tags.slice(0, i), ...this.props.tags.slice(i + 1)];
    this.props.update({tags: tags});
  };

  toggleTagModal = () => {
    this.setState({newTagPending: null});
  };

  onCategoryChange = name => {
    if (!name) return;
    this.props.update(state => {
      if (CATEGORIES.find(cat => cat.name === name)) {
        // if it's a predefined category
        if (state.categories.includes(name)) {
          return {categories: without(state.categories, name)};
        } else {
          return {categories: uniq(state.categories.concat(name)), missingCategories: false};
        }
      } else {
        // it's not predefined
        const otherCategory = this.getOtherCategoryInState(state.categories);
        if (otherCategory) {
          if (otherCategory !== name) {
            return {categories: without(state.categories, otherCategory).concat(name)};
          } else {
            return {categories: without(state.categories, otherCategory)};
          }
        } else {
          return {categories: uniq(state.categories.concat(name)), missingCategories: false};
        }
      }
    });
  };

  getOtherCategoryInState = categories => {
    return categories.find(cat => !CATEGORIES.find(cat2 => cat2.name === cat));
  };

  onCategoryInputChange = e => {
    const value = e.target.value;
    this.setState({otherCategory: value}, () => {
      this.props.update(state => {
        let newCategories = state.categories;
        const otherCategory = this.getOtherCategoryInState(newCategories);
        if (otherCategory !== null) {
          newCategories = without(newCategories, otherCategory);
        }
        if (value) {
          newCategories = newCategories.concat(value);
        }
        return {categories: newCategories};
      });
    });
  };

  render() {
    const {allTags, categories, proposalType, tags, title, outline, abstract, legal} = this.props;
    const {abstractLen, abstractErr, newTagPending, coSpeaker} = this.state;
    let bestMatch,
      predefinedTags,
      tagObjs = tags.map(t => ({id: t, text: t}));

    const tagSuggestions = uniq(without(PREDEFINED_TAGS.concat(allTags), ...tags));
    predefinedTags = without(PREDEFINED_TAGS, ...tags);

    if (newTagPending) {
      bestMatch = findBestMatch(newTagPending, tagSuggestions).bestMatch.target;
    }

    return (
      <div>
        {/* StepFour continues here and ends in */}
        <h4 className="mb-0">Public information</h4>
        <p className="font-size-sm text-gray-600">
          The following information will be presented in the website
        </p>
        <FormField
          id="title"
          label="Title"
          required={true}
          placeholder="Title of your talk"
          maxLength="100"
          value={title}
          className={cn(SPACING, 'max-width: 500px;')} //titleInput from the css file was max-width: 500px
          subtitle={<TitleFieldCaption />}
        />
        <FormField
          id="proposalType"
          inputType="radio"
          required={true}
          onChange={this.handleProposalTypeChange}
          values={PROPOSAL_TYPES_ARR}
          value={proposalType}
          className={SPACING}
        />
        <FormField
          id="coSpeaker"
          label="Co-Speaker (optional)"
          required={false}
          placeholder={`co.speaker@email.com`}
          subtitle={<CoSpeakerFieldCaption/>}
          onChange={this.onChangeCoSpeaker}
          className={SPACING}
          value={coSpeaker}
        />
        {/* StepFive  (with title something like: StepFour Continue*/}
        <FormField
          id="abstract"
          label="Abstract"
          required={true}
          multiline={true}
          value={abstract}
          placeholder={`Between ${ABSTRACT_MIN}-${ABSTRACT_MAX} characters (the length of 2-5 tweets)`}
          subtitle={<AbstractFieldCaption abstractLen={abstractLen} abstractErr={abstractErr} />}
          onChange={this.onChangeAbstract}
          className={SPACING}
        />
        <Tags
          tags={tagObjs}
          suggestions={tagSuggestions}
          predefinedSuggestions={predefinedTags}
          handleAddition={this.onAddTag}
          handleDelete={this.onDeleteTag}
          readOnly={tags.length === MAX_TAGS}
          className={SPACING}
        />

        <Modal isOpen={!!newTagPending} toggle={this.toggleTagModal}>
          <ModalHeader toggle={this.toggleTagModal}>'{newTagPending}' doesn't exist</ModalHeader>
          <ModalBody>
            <p>
              Before adding a new tag, please check if there's already an existing tag like this
              one.
            </p>
            {bestMatch && (
              <p>
                Did you mean <b>{bestMatch}</b>?
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            {bestMatch && (
              <Button
                size="sm"
                color="primary"
                onClick={e => {
                  e.preventDefault();
                  this.addTag(bestMatch);
                  this.setState({newTagPending: null});
                }}>
                Add <b>{bestMatch}</b>
              </Button>
            )}
            <Button
              outline
              color="primary"
              size="sm"
              onClick={e => {
                e.preventDefault();
                this.addTag(newTagPending);
                this.setState({newTagPending: null});
              }}>
              Add <b>{newTagPending}</b>
            </Button>
          </ModalFooter>
        </Modal>

        <label>Categories</label>
        <small className="d-block mb-2">
          Choose 1 or 2 categories. This information will help us assign this session to one of the
          conference's tracks.
        </small>
        <input required={true} type="hidden" id="categories_hidden" />
        <div hidden={!this.props.missingCategories} className={'text-red mb-2'}>*choose at least one category</div>
        {CATEGORIES.map(category => {
          const checked = categories.includes(category.name);
          return (
            <CategoryCheckbox
              key={category.name}
              {...category}
              onChange={this.onCategoryChange}
              checked={checked}
              disabled={!checked && categories.length === MAX_CATEGORIES}
            />
          );
        })}
        <CategoryOther
          checked={!!this.getOtherCategoryInState(categories)}
          onChange={() => this.onCategoryChange(this.state.otherCategory)}
          onChangeInput={this.onCategoryInputChange}
          disabled={
            !this.getOtherCategoryInState(categories) && categories.length === MAX_CATEGORIES
          }
        />
        {/* StepSix (Final Step before the summery) */}
        <FormField
          id="outline"
          label="Outline &amp; private notes"
          required={true}
          multiline={true}
          value={outline}
          placeholder=""
          subtitle={<OutlineFieldCaption />}
          className={SPACING}
        />
        <div className={cn(SPACING, 'd-flex')}>
          <input type="checkbox" id="legal" defaultChecked={legal} required className="mr-3 mt-1" />
          <label htmlFor="legal">
            I agree that all presented materials will be shared on the web by Reversim team,
            including the slides, video on youtube and mp3 on the podcast.
          </label>
        </div>
      </div>
    );
  }
}

export default ProposalForm;
