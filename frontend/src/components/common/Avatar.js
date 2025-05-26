import React, { useState } from 'react';
import defaultAvatar from '../../assets/avatars/avatar.png';

const Avatar = ({ avatarUrl, name, className = '' }) => {
    const [useDefaultAvatar, setUseDefaultAvatar] = useState(false);

    try {
        // Chỉ thử parse nếu avatarUrl là string
        if (typeof avatarUrl === 'string') {
            const avatarData = JSON.parse(avatarUrl);
            
            if (avatarData.type === 'letter') {
                return (
                    <div
                        className={className}
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: avatarData.backgroundColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            borderRadius: '50%'
                        }}
                    >
                        {avatarData.letter}
                    </div>
                );
            }
        }

        // Nếu không phải letter avatar hoặc parse thất bại, hiển thị ảnh
        return (
            <img
                src={useDefaultAvatar ? defaultAvatar : (avatarUrl || defaultAvatar)}
                alt={name || 'Avatar'}
                className={className}
                onError={() => setUseDefaultAvatar(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                }}
            />
        );
    } catch (e) {
        // Nếu có lỗi khi parse JSON, hiển thị ảnh bình thường
        return (
            <img
                src={useDefaultAvatar ? defaultAvatar : (avatarUrl || defaultAvatar)}
                alt={name || 'Avatar'}
                className={className}
                onError={() => setUseDefaultAvatar(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                }}
            />
        );
    }
};

export default Avatar;