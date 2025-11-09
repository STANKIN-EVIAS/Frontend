import ReviewsList from "components/Reviews/ReviewsList";

const ReviewsPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Отзывы</h1>
            <ReviewsList />
        </div>
    );
};

export default ReviewsPage;
