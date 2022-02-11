import './stylesheet.scss';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Dashicon,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import {
	dispatchUpdateSnackbar,
} from '../../util/helpers';

const ErrorCard = ({ error, className }) => {
    dispatchUpdateSnackbar('Error!');
	return (
        <Card className={classNames('error-card', className)}>
            <CardHeader>
                <Heading level="3">
                    <Dashicon icon="warning" style={{ fontSize: "24px", width: "24px", height: "24px" }} />
                    {' '}
                    {__('Oh No, An Error!', 'hostgator-wordpress-plugin')}
                </Heading>
            </CardHeader>
            <CardBody>
                <p>{__('You found an error, please refresh the page and try again!', 'hostgator-wordpress-plugin')}</p>
                <p>{__('If the error persists, please contact support.', 'hostgator-wordpress-plugin')}</p>
            </CardBody>
            <CardFooter>
                <p>
                    { error.message ? error.message : '' }
                    { error.data ? __(' Error code: ', 'hostgator-wordpress-plugin') + error.data.status : '' }
                </p>
            </CardFooter>
        </Card>
	);
};

export default ErrorCard;
