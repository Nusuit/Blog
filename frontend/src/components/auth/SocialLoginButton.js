import React from 'react';
import googleIcon from '../../assets/googleIcon.svg'; // Đường dẫn đến file SVG
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/auth/SocialLogin.css';

const SocialLoginButton = ({ type }) => {
    const renderIcon = () => {
        if (type === 'Google') {
            return (
                <img
                    src={googleIcon}
                    alt="Google Icon"
                    style={{
                        width: '24px', // Đặt kích thước lớn hơn để cân đối
                        height: '24px',
                        marginRight: '12px', // Đẩy icon cách chữ hợp lý hơn
                        verticalAlign: 'middle', // Đảm bảo icon nằm giữa chữ
                    }}
                />
            );
        }
        if (type === 'Phone Number') {
            return (
                <FontAwesomeIcon
                    icon={faPhone}
                    style={{
                        fontSize: '20px',
                        marginRight: '10px', // Tạo khoảng cách giữa icon và chữ
                        color: '#4CAF50', // Màu sắc đặc trưng cho icon Phone
                    }}
                />
            );
        }
        return null;
    };

    return (
        <button className="social-login">
            {renderIcon()}
            <span>Continue with {type}</span>
        </button>
    );
};

export default SocialLoginButton;
