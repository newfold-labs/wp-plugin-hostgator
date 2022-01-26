import './stylesheet.scss';
import graphicUrl from '../../../../assets/svg/a-illustration__checklist.svg';

import CacheSettings from './cacheSettings';
import ClearCache from './clearCache';
import SettingsCallout from './settingsCallout';

const Performance = () => {
	return (
		<div className="hgwp-Performance grid col2 has-page-graphic">
			<div>
				<CacheSettings />
				<br />
				<ClearCache />
				<br />
				<SettingsCallout />
			</div>
			<div>
				<img src={graphicUrl} style={{ float: 'right' }} />
			</div>
		</div>
	);
};

export default Performance;
