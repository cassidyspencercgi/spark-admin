export interface User {
    "app_user_id": number,
    "app_user_email": String,
    "app_user_password": String,
    "app_user_name": String,
    "app_user_type": number,
    app_user_root_user_id?: number,
    "app_user_parent_passcode": String | null,
    "app_user_reset_pwd_required": boolean,
    "app_user_enabled": boolean
}