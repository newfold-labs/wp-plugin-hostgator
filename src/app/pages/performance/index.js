import './stylesheet.scss';
import { ReactComponent as Graphic } from '../../../../assets/svg/a-illustration__checklist.svg';

import CacheSettings from './cacheSettings';
import ClearCache from './clearCache';

const Performance = () => {
	
	return (
		<div className="hgwp-Performance grid col2 has-page-graphic">
			<CacheSettings />
			<ClearCache />
			<Graphic className="hgwp-page-graphic" />
		</div>
	);
};

export default Performance;
