DROP PROCEDURE IF EXISTS sp_register_customer;

DELIMITER $$

CREATE PROCEDURE sp_register_customer(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(150),
    IN p_password VARCHAR(255),
    IN p_phone VARCHAR(20)
)
BEGIN

    IF EXISTS (
        SELECT 1
        FROM users
        WHERE email = p_email
    ) THEN

        SELECT
            0 AS success,
            'Email already registered' AS message;

    ELSE

        INSERT INTO users (
            name,
            email,
            password,
            phone,
            status
        )
        VALUES (
            p_name,
            p_email,
            p_password,
            p_phone,
            'active'
        );

        SELECT
            1 AS success,
            LAST_INSERT_ID() AS user_id,
            'Registration successful' AS message;

    END IF;

END$$

DELIMITER ;

-- Login Stored Procedure

DROP PROCEDURE IF EXISTS sp_customer_login;

DELIMITER $$

CREATE PROCEDURE sp_customer_login(
    IN p_email VARCHAR(150)
)
BEGIN

    SELECT
        id,
        name,
        email,
        password,
        phone,
        address,
        city,
        state,
        pincode,
        status
    FROM users
    WHERE email = p_email
    LIMIT 1;

END$$

DELIMITER ;

-- Add to Cart

DROP PROCEDURE IF EXISTS sp_add_to_cart;

DELIMITER $$

CREATE PROCEDURE sp_add_to_cart(
    IN p_user_id INT,
    IN p_product_id INT,
    IN p_quantity INT
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_stock INT;
    DECLARE v_price DECIMAL(10, 2);
    DECLARE v_existing_quantity INT DEFAULT 0;

    -- Check product
    SELECT stock, price
    INTO v_stock, v_price
    FROM products
    WHERE id = p_product_id
    AND status = 'active'
    LIMIT 1;

    IF v_stock IS NULL THEN

        SELECT
            0 AS success,
            'Product not found or inactive' AS message;

    ELSEIF p_quantity <= 0 THEN

        SELECT
            0 AS success,
            'Invalid quantity' AS message;

    ELSE

        -- Find existing cart
        SELECT id
        INTO v_cart_id
        FROM cart
        WHERE user_id = p_user_id
        LIMIT 1;

        -- Create cart if needed
        IF v_cart_id IS NULL THEN

            INSERT INTO cart (user_id)
            VALUES (p_user_id);

            SET v_cart_id = LAST_INSERT_ID();

        END IF;

        -- Check existing item
        SELECT quantity
        INTO v_existing_quantity
        FROM cart_items
        WHERE cart_id = v_cart_id
        AND product_id = p_product_id
        LIMIT 1;

        -- Check total quantity against stock
        IF (v_existing_quantity + p_quantity) > v_stock THEN

            SELECT
                0 AS success,
                CONCAT(
                    'Only ',
                    v_stock,
                    ' items available'
                ) AS message;

        ELSE

            INSERT INTO cart_items (
                cart_id,
                product_id,
                quantity,
                price
            )
            VALUES (
                v_cart_id,
                p_product_id,
                p_quantity,
                v_price
            )
            ON DUPLICATE KEY UPDATE
                quantity = quantity + p_quantity,
                price = v_price;

            SELECT
                1 AS success,
                'Product added to cart' AS message;

        END IF;

    END IF;
END$$

DELIMITER ;


-- get cart

DROP PROCEDURE IF EXISTS sp_get_cart;

DELIMITER $$

CREATE PROCEDURE sp_get_cart(
    IN p_user_id INT
)
BEGIN

    SELECT
        ci.id AS cart_item_id,
        ci.product_id,
        p.name,
        p.slug,
        COALESCE(
            (
                SELECT pi.image
                FROM product_images pi
                WHERE pi.product_id = p.id
                ORDER BY pi.is_primary DESC, pi.id ASC
                LIMIT 1
            ),
            ''
        ) AS image,
        p.price,
        p.stock,
        ci.quantity,
        (p.price * ci.quantity) AS item_total

    FROM cart c

    INNER JOIN cart_items ci
        ON ci.cart_id = c.id

    INNER JOIN products p
        ON p.id = ci.product_id

    WHERE c.user_id = p_user_id

    ORDER BY ci.created_at DESC;

END$$

DELIMITER ;

-- Update Cart Quantity

DROP PROCEDURE IF EXISTS sp_update_cart_quantity;

DELIMITER $$

CREATE PROCEDURE sp_update_cart_quantity(
    IN p_user_id INT,
    IN p_cart_item_id INT,
    IN p_quantity INT
)
BEGIN
    DECLARE v_stock INT;

    SELECT
        p.stock
    INTO v_stock
    FROM cart_items ci

    INNER JOIN cart c
        ON c.id = ci.cart_id

    INNER JOIN products p
        ON p.id = ci.product_id

    WHERE ci.id = p_cart_item_id
      AND c.user_id = p_user_id

    LIMIT 1;

    IF v_stock IS NULL THEN

        SELECT
            0 AS success,
            'Cart item not found' AS message;

    ELSEIF p_quantity <= 0 THEN

        SELECT
            0 AS success,
            'Invalid quantity' AS message;

    ELSEIF p_quantity > v_stock THEN

        SELECT
            0 AS success,
            CONCAT(
                'Only ',
                v_stock,
                ' items available'
            ) AS message;

    ELSE

        UPDATE cart_items ci
        INNER JOIN cart c
            ON c.id = ci.cart_id

        SET ci.quantity = p_quantity

        WHERE ci.id = p_cart_item_id
          AND c.user_id = p_user_id;

        SELECT
            1 AS success,
            'Cart quantity updated' AS message;

    END IF;

END$$

DELIMITER ;

-- Remove Cart Item

DROP PROCEDURE IF EXISTS sp_remove_from_cart;

DELIMITER $$

CREATE PROCEDURE sp_remove_from_cart(
    IN p_user_id INT,
    IN p_cart_item_id INT
)
BEGIN

    DELETE ci
    FROM cart_items ci

    INNER JOIN cart c
        ON c.id = ci.cart_id

    WHERE ci.id = p_cart_item_id
      AND c.user_id = p_user_id;

    IF ROW_COUNT() > 0 THEN

        SELECT
            1 AS success,
            'Item removed from cart' AS message;

    ELSE

        SELECT
            0 AS success,
            'Cart item not found' AS message;

    END IF;

END$$

DELIMITER ;

-- Clear Cart
DROP PROCEDURE IF EXISTS sp_clear_cart;

DELIMITER $$

CREATE PROCEDURE sp_clear_cart(
    IN p_user_id INT
)
BEGIN

    DELETE ci
    FROM cart_items ci

    INNER JOIN cart c
        ON c.id = ci.cart_id

    WHERE c.user_id = p_user_id;

    SELECT
        1 AS success,
        'Cart cleared successfully' AS message;

END$$

DELIMITER ;


