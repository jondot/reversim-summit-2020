import React from 'react';
import styled from 'styled-components';

import { SponsorMiniPremium } from './SponserGeneralComps';

const PremiunSponsorsSection = styled.section`
  ${ ( { theme: { mq } } ) => `
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      
      @media (max-width: ${mq.l}) {
        justify-content: space-around;
      }
    `}
`;

const HomePremiumSponsors = ({ sponsors }) =>{
  return (
    <PremiunSponsorsSection>
      {sponsors
      .filter(sponsor => sponsor.isPremium)
      .map((sponsor, i) => {
        return (
          <div key={i}>
            <SponsorMiniPremium key={sponsor._id} isOnWhite={true} {...sponsor} />
          </div>
        );
      })}
    </PremiunSponsorsSection>
  );
};

export default HomePremiumSponsors;
