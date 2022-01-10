import { __experimentalHeading as Heading } from '@wordpress/components';
import MarketplaceItem from '../../components/marketplaceItem';
import themes from '../../data/themes';

const Themes = () => {

	return (
        <>
        <Heading>Themes</Heading>
        <div className="hgwp-themes grid col2">
			{themes.map((item) => (
                <MarketplaceItem item={item} />
            ))}
        </div>
        </>
    );
};

export default Themes;